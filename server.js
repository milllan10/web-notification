const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

// Update CORS configuration
const corsOptions = {
  origin: 'https://web-notification-frontend.vercel.app', // Allow only your frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true, // Include credentials if required
};

app.use(cors(corsOptions));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://web-notification-frontend.vercel.app', // Frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true, // Allow credentials for socket connections
    transports: ['websocket', 'polling'], // Support both WebSocket and polling
  },
});

app.get('/', (req, res) => {
  res.send('Connected to Backend');
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('sendNotification', (data) => {
    io.emit('receiveNotification', data); // Broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
