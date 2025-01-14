const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

// Update CORS configuration for express and socket.io
const corsOptions = {
  origin: 'https://web-notification-frontend.vercel.app',  // Allow only your frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://web-notification-frontend.vercel.app',  // Allow only your frontend URL for WebSocket connections
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    transports: ['websocket', 'polling'],  // Allow both WebSocket and polling
  },
});

app.get('/', (req, res) => {
  res.send('Connected to Backend');
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('sendNotification', (data) => {
    io.emit('receiveNotification', data);  // Send to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
