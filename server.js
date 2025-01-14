const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

// Update CORS configuration to allow any origin
const corsOptions = {
  origin: '*',  // Allow all origins
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',  // Same as above: Allow any origin
    methods: ['GET', 'POST'],
  },
});

app.get('/', (req, res) => {
  res.send('Connected to Backend');
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

server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
