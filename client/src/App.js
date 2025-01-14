import React, { useEffect } from 'react';
import { io } from 'socket.io-client';

// Use production or local backend URL
const socket = io(
  process.env.NODE_ENV === 'production'
    ? 'https://web-notification-snowy.vercel.app' // Production backend
    : 'http://localhost:5000', // Local backend
  {
    transports: ['websocket'], // Use WebSocket for better performance
    withCredentials: true, // Include credentials if needed
  }
);

const App = () => {
  useEffect(() => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications.');
      return;
    }

    // Listen for notifications from the server
    socket.on('receiveNotification', (data) => {
      if (Notification.permission === 'granted') {
        new Notification('New Notification', {
          body: data.message,
          icon: 'https://via.placeholder.com/128', // Optional icon
        });
      } else {
        console.log('Notification received but not displayed:', data.message);
      }
    });

    return () => socket.off('receiveNotification');
  }, []);

  const requestPermission = () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications.');
      return;
    }

    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        alert('Notifications enabled!');
      } else {
        alert('Notifications disabled.');
      }
    });
  };

  const sendNotification = () => {
    const message = prompt('Enter a notification message:');
    if (message && message.trim()) {
      socket.emit('sendNotification', { message });
    } else {
      alert('Please enter a valid message.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Web Notifications Demo</h1>
      <button
        onClick={requestPermission}
        className="px-4 py-2 bg-green-500 text-white rounded"
        aria-label="Enable Notifications"
      >
        Enable Notifications
      </button>
      <button
        onClick={sendNotification}
        className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        aria-label="Send Notification"
      >
        Send Notification
      </button>
    </div>
  );
};

export default App;
