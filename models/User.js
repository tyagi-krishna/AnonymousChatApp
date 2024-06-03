const mongoose = require('mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  socketId: { type: String, required: true, unique: true }
});

// Export the user model
module.exports = mongoose.model('User', userSchema);
