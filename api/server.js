const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');
const express = require('express');

const app = express();

// Set up CORS
const allowedOrigin = process.env.NODE_ENV === 'production' ? 'https://web-notification-rho.vercel.app' : 'http://localhost:3000';
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST'],
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('sendNotification', (data) => {
    io.emit('receiveNotification', data); // Send to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Export as serverless function
module.exports = (req, res) => {
  server(req, res); // Let Vercel handle the HTTP request
};
