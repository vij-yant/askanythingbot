// static/script.js

// Import necessary elements from the DOM
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

let socket;

// Function to initialize WebSocket connection
function initWebSocket() {
    // Connect to WebSocket server
    socket = new WebSocket('ws://localhost:3000');

    // WebSocket event listeners
    socket.onopen = () => {
        console.log('Connected to WebSocket server');
    };

    socket.onmessage = (event) => {
        // Parse the received message as JSON
        const message = JSON.parse(event.data);
        console.log('Received message from server:', message); // Log received message
        // Display received message in chat box
        receiveMessage(message);
    };

    socket.onclose = () => {
        console.log('Disconnected from WebSocket server');
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
}

// Function to send message to server
function sendMessage() {
    const message = userInput.value.trim();
    if (message !== '') {
        // Send message to server via WebSocket
        if (socket.readyState === WebSocket.OPEN) {
            console.log('Sending message to server:', message); // Log message before sending
            socket.send(JSON.stringify(message)); // Convert message to string before sending
            appendMessage('user', message);
            userInput.value = '';
        } else {
            console.error('WebSocket connection is not open');
        }
    }
}

// Function to receive message from server and display in chat box
function receiveMessage(message) {
    appendMessage('bot', message);
}

// Function to append message to chat box
function appendMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender === 'user' ? 'user' : 'bot');
    messageElement.innerText = message;
    chatBox.appendChild(messageElement);
}

// Initialize WebSocket connection when the page loads
window.onload = function() {
    initWebSocket();
};
