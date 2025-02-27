import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const handleSubmit = async () => {
    const messageInput = document.getElementById('messageInput')
    if (!messageInput) return
    const userMessage = messageInput.value
    messageInput.value = ''

    const message = JSON.stringify({role: 'user', content: userMessage })
    console.log("User: " + userMessage)
    let response = null
    try {
      response = await fetch('http://localhost:5000/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: message,
      })
    } catch (error) {
        console.error('Error:', error)
        return
    }
    const data = await response.json()

    console.log("Assistant: " + data.response)
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
