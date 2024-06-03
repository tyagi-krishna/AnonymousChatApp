const express = require('express');
const path = require('path');
const router = express.Router();

// Route to serve the index.html file
router.get('/', (req, res) => {
  // Use path.join to construct the absolute path to the index.html file
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = router;
