const socket = io();

// Event listener for successful connection to the server
socket.on('connect', () => {
  console.log('Connected to the server');
  // Notify the server that the client is ready
  socket.emit('clientReady');
});

// Event listener for disconnection from the server
socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});

// Event listener for socket errors
socket.on('error', (error) => {
  console.error('Socket error:', error);
});

// Event listener for reconnection attempts
socket.on('reconnect_attempt', (attempt) => {
  console.log(`Reconnection attempt ${attempt}`);
});

// Event listener for reconnection failures
socket.on('reconnect_failed', () => {
  console.error('Reconnection failed');
});

// Event listener for successful reconnection
socket.on('reconnect', (attemptNumber) => {
  console.log(`Reconnected successfully after ${attemptNumber} attempts`);
});
