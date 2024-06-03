const mongoose = require('mongoose');

// Define chat schema
const chatSchema = new mongoose.Schema({
  users: {
    type: [String],
    required: true,
    validate: [arrayLimit, '{PATH} should have at least 2 users']
  },
  messages: [{
    sender: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
});

// Validator function to ensure at least 2 users in the chat
function arrayLimit(val) {
  return val.length >= 2;
}

// Export the chat model
module.exports = mongoose.model('Chat', chatSchema);
