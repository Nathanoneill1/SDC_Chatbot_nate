import { useState } from 'react'

function App() {

  // creates a persistent variable for the conversation history 
  // the first is set to a system message, this gives the AI context
  const [conversationHistory, setConversationHistory] = useState([{role: 'system', content: "You are a sarcastic Doctor."}]) 

  const updateConversationHistory = async (role, content) => { // this makes updating the conversationHistory a bit easier to type
    setConversationHistory([...conversationHistory, {role: role, content: content}])
  }

  // this is the function that runs when the submit button is pushed
  const handleSubmit = async () => {
    let currentHistory = conversationHistory; // this allows for a current history in the function due to useStates not immediately updating
    const messageInput = document.getElementById('messageInput') // get the property info for the "messageInput" html element
    if (!messageInput) return // if there is no message, return
    const userMessage = messageInput.value // get the value property from the "messageInput" html element
    updateConversationHistory('user', userMessage) // update the conversationHistory useState with the new user message
    currentHistory.push({role: 'user', content: userMessage}); // update the currentHistory with the new user message
    messageInput.value = '' // reset the "messageInput" elements value to blank
    const messages = JSON.stringify({ messages: currentHistory }) // convert the currentHistory array object into a JSON string with the overarching object "messages"
    console.log(messages) // display the messages JSON
    
    console.log("User: " + userMessage) // displays the users message

    let response = null // create response outside of catch/try scope so it can be used
    try {
      response = await fetch('http://localhost:5000/chatbot', { // send a request to the Open AI api on the serverside
        method: 'POST', // using method POST
        headers: { // this includes any addition information necessary for transmission
          'Content-Type': 'application/json', // this indicates that JSON text is being transmitted
        },
        body: messages, // this is the body of the request, which contains the chat history
      })
    } catch (error) {
        console.error('Error:', error) // display error to the terminal
        updateConversationHistory('assistant', "I'm sorry, It seems like there was an error with the connection.") // push an error message from the assistant onto the conversation History
        console.log("Assistant: " + "I'm sorry, It seems like there was an error with the connection.")
        return
    }
    const data = await response.json()

    console.log("Assistant: " + data.response)
    updateConversationHistory('assistant', data.response)

  }

  return (
    <>
      <div id="prompt">
        <input id="messageInput" contentEditable></input>
        <button id="submit" onClick={handleSubmit}></button>    
      </div>
    </>
  )
}

export default App
