require('dotenv').config();

// Create an express app
const express = require('express');
const cors = require('cors'); // NEED TO INSTALL
const app = express();
app.use(express.json());
app.use(cors()); // Allow cross-origin requests, remove this line if you don't want to allow cross-origin requests


// Port
const PORT = process.env.PORT;

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Error occurred");
});

// OpenAI API
const {OpenAI} = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
app.post('/chatbot', async (req, res) => {
    try{
        const userMessage = req.body; // Get user message
        console.log("user: " + userMessage);    
    
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [userMessage], // Include the conversation history
            temperature: 0.9, // Control the randomness of responses
        });
        let AIMessage = response.choices[0].message.content;
        console.log("assistant: " + AIMessage);
        return res.json({ response: AIMessage });
    
    } catch (error) {
        res.status(500).json({error: 'Error occurred while asking OpenAI'});
        console.error(error);
    }
});

app.get('/', (req, res) => {
    res.send('server is running');
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Listening at 0.0.0.0:${PORT}`);
});