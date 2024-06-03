const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { MongoClient } = require('mongodb');
const { validateMessage } = require('./validators/chat');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const uri = 'mongodb+srv://manu:manu321@cluster0.tqvxmv1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static('public'));
const chatRoute = require('./routes/chatRoute');
app.use('/', chatRoute);

let users = [];
let chatPairs = new Map();

io.on('connection', (socket) => {
  console.log('New connection');

  // Assign a unique user ID
  const userId = `User ${users.length + 1}`;
  users.push({ id: userId, socketId: socket.id });
  socket.emit('userId', userId);

  // Find a chat partner
  findChatPartner(socket);

  socket.on('disconnect', () => {
    console.log('User disconnected');
    removeUser(socket.id);
    findNewChatPartner(socket);
  });

  socket.on('sendMessage', (message) => {
    try {
      const { error } = validateMessage({ message });
      if (error) {
        console.error(error);
        return;
      }

      console.log(`Received message from ${userId}: ${message}`);
      broadcastMessage(socket, message);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('next', () => {
    console.log('Next button clicked');
    findNewChatPartner(socket);
  });

  socket.on('clientReady', () => {
    console.log('Client is ready');
    // You can perform some initialization or send a welcome message here
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

function findChatPartner(socket) {
  const userId = users.find((user) => user.socketId === socket.id).id;
  let chatPartner;

  for (let i = 0; i < users.length; i++) {
    if (users[i].socketId !== socket.id && !chatPairs.has(users[i].id)) {
      chatPartner = users[i].id;
      break;
    }
  }

  if (chatPartner) {
    // Create a new chat pair
    chatPairs.set(userId, chatPartner);
    chatPairs.set(chatPartner, userId);
    console.log(`New chat pair: ${userId} and ${chatPartner}`);

    // Emit the chat partner's ID to the user
    socket.emit('chatPartner', chatPartner);
    const chatPartnerSocketId = users.find((user) => user.id === chatPartner).socketId;
    io.to(chatPartnerSocketId).emit('chatPartner', userId);
  } else {
    setTimeout(() => findChatPartner(socket), 1000);
  }
}

function findNewChatPartner(socket) {
  const userId = users.find((user) => user.socketId === socket.id).id;
  const currentChatPartnerId = chatPairs.get(userId);
  if (currentChatPartnerId) {
    chatPairs.delete(userId);
    chatPairs.delete(currentChatPartnerId);
  }
  findChatPartner(socket);
}

function removeUser(socketId) {
  const index = users.findIndex((user) => user.socketId === socketId);
  if (index !== -1) {
    const userId = users[index].id;
    const currentChatPartnerId = chatPairs.get(userId);
    if (currentChatPartnerId) {
      chatPairs.delete(userId);
      chatPairs.delete(currentChatPartnerId);
    }
    users.splice(index, 1);
  }
}

function broadcastMessage(socket, message) {
    const userId = users.find((user) => user.socketId === socket.id).id;
    const chatPartnerId = chatPairs.get(userId);
    const chatPartnerSocketId = users.find((user) => user.id === chatPartnerId).socketId;
    
    // Emit the message to the sender
    socket.emit('receiveMessage', message);
    
    // Emit the message to the chat partner
    io.to(chatPartnerSocketId).emit('receiveMessage', message);
  }
  

connectToMongoDB();
