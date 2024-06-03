// Get DOM elements
const chatLog = document.getElementById('chat-log');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');
const nextButton = document.getElementById('next');

// Function to send a message
const sendMessage = (message) => {
  // Emit 'sendMessage' event with the message content
  socket.emit('sendMessage', message);
  // Clear the message input field after sending
  messageInput.value = '';
};

// Event handler for send button click
const handleSendButtonClick = () => {
  // Get the trimmed message content from the input field
  const message = messageInput.value.trim();
  // If the message is not empty, send it
  if (message) {
    sendMessage(message);
  }
};

// Event handler for next button click
const handleNextButtonClick = () => {
  // Emit 'next' event to find a new chat partner
  socket.emit('next');
};

// Function to add a received message to the chat log
const addMessageToChatLog = (message) => {
  // Create a new div element for the message
  const div = document.createElement('div');
  // Set the text content of the div to the message
  div.textContent = message;
  // Append the div to the chat log
  chatLog.appendChild(div);
  // Scroll to the bottom of the chat log to show the latest message
  chatLog.scrollTop = chatLog.scrollHeight;
};

// Function to update the chat partner in the UI
const updateChatPartner = (id) => {
  document.getElementById('partner').textContent = `Chat Partner: ${id}`;
};

// Function to update the user ID in the UI
const updateUserId = (id) => {
  document.getElementById('user-id').textContent = `User ID: ${id}`;
};

// Event listener for receiving messages
socket.on('receiveMessage', (message) => {
  // Add the received message to the chat log
  addMessageToChatLog(message);
});

// Event listener for receiving chat partner information
socket.on('chatPartner', (id) => {
  // Update the chat partner in the UI
  updateChatPartner(id);
});

// Event listener for receiving user ID information
socket.on('userId', (id) => {
  // Update the user ID in the UI
  updateUserId(id);
});

// Event listeners for send and next buttons
sendButton.addEventListener('click', handleSendButtonClick);
nextButton.addEventListener('click', handleNextButtonClick);

// Optional: Handle "Enter" key press for sending messages
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleSendButtonClick();
  }
});
