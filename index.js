const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const axios = require('axios');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Function to make API call using Axios
async function query(data) {
    try {
        const response = await axios.post(
            process.env.API_URL,
            {inputs:data},
            {
                headers: { Authorization: `Bearer ${process.env.API_TOKEN}` }
            }
        );
        return response.data; // Assuming the structure of the response
    } catch (error) {
        throw new Error('API request failed');
    }
}

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', async (message) => {
        try {
            console.log('Received message from client:', message); // Log received message
            // Parse the received message as JSON
            const parsedMessage = JSON.parse(message);

            // Make API call to OpenAI
            const response = await query(parsedMessage);

            // Parse the API response to extract the generated text
            const generatedText = response[0].generated_text.substr(message.length);
            console.log('Response from OpenAI:', generatedText); 

            // Send the generated text back to the client over WebSocket
            ws.send(JSON.stringify(generatedText));
        } catch (error) {
            console.error('Error processing message:', error);
            ws.send(JSON.stringify({ error: 'Internal server error' }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
