require('dotenv').config();

// Create an express app
const express = require('express'); // framework for Node.JS
const cors = require('cors'); // cors permits communication between different ports
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
const {OpenAI} = require('openai'); // import the OpenAI class
const openai = new OpenAI({ // create instance of OpenAI class with API key
    apiKey: process.env.OPENAI_API_KEY,
});
app.post('/chatbot', async (req, res) => { // this indicates that a POST method will be used to communicate with the API at "url/chatbot"
    try{
        const conversationHistory = req.body.messages; // retrieves the conversation history from the body of the request
        console.log(conversationHistory); // displays the conversation history server side
        console.log("User: " + conversationHistory[conversationHistory.length - 1].content); // displays the most recent message server side
    
        const response = await openai.chat.completions.create({ // sends the messages to the Open AI api for a chat completion
            model: 'gpt-4o-mini', // The LLM model used
            messages: conversationHistory, // Include the conversation history
            temperature: 0.9, // Control the randomness of responses
        });
        let AIMessage = response.choices[0].message.content; // get first option of responses from the API
        console.log("Assistant: " + AIMessage); // displays the ai generated message server side
        return res.json({ response: AIMessage }); // sends the ai generated message back to the client
    
    } catch (error) {
        res.status(500).json({error: 'Error occurred while asking OpenAI'}); // sends the error message back to the client
        console.error(error); // displays the error server side
    }
});

app.get('/', (req, res) => { // indicates that the server is properly running when accessing the base url
    res.send('server is running');
});

// Start the server
app.listen(PORT, '0.0.0.0', () => { // sets the server to allow requests from IP 0.0.0.0 (any IP) at the set port
    console.log(`Listening at 0.0.0.0:${PORT}`); // displays that the server is working
});