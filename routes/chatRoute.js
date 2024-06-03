const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const { validateMessage } = require('../validators/chat');

// Middleware to parse JSON
router.use(express.json());

// Endpoint to handle sending messages
router.post('/message', async (req, res) => {
  try {
    const { message, username, chatId } = req.body;

    // Validate the message using the validation function
    const { error } = validateMessage({ message });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Find the chat session or create a new one
    let chat = await Chat.findById(chatId);
    if (!chat) {
      chat = new Chat({ users: [username], messages: [] });
    }

    // Add the message to the chat
    chat.messages.push({ sender: username, content: message });
    const savedChat = await chat.save();

    // Respond with the details of the saved chat message
    res.json({ id: savedChat.id, username, message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create chat message' });
  }
});

module.exports = router;
