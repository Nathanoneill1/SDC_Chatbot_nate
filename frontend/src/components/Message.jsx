import {useState, useEffect} from 'react';
// props: message, color, id

const Message = (props) => {
    const [words, setWords] = useState(props.message === undefined ? "I'm sorry, It seems like there was an error sending the message.".split(' ') : props.message.split(' ')); // stores the message to be displayed, if no message is entered for some reason, it will display an error
    const [message, setMessage] = useState(''); // stores the current message output
    const [count, setCount] = useState(-1); // the count keeps track of the index of the word that needs to be added to the message, initiallizing to -1 ensures the first render doesn't add a duplicate first word

    // this function helps procedurally generate the messages
    const writeMessage = () => {
        // prevMessage represents the previous state
        // [...] spreads the existing array into a new array (ensuring immutability).
        // words[count] adds the new word at the end.
        setMessage(prevMessage => [...prevMessage, words[count]+' ']);
        setCount(count + 1);
    }

    useEffect(() => { // useEffect enables re-rendering upon the update of a dependency, parameters are a function (arrow function in this case) and a dependency array
        if (count === -1) { // sets the count to 0 during the first render
            setCount(0);
        }
        else if (count < words.length) { // while there are words to display, continue
            setTimeout(writeMessage, 100); // sets a 100 ms delay between adding words to display
            const newMessage = document.getElementById(props.id); // gets the information of the Message element from the DOM
            newMessage.scrollIntoView(); // scrolls the Message into view as it generates
        }
    }, [count]); // dependency array with count, when count is updated, this function is run and rerenders updated part of component

    return (
        // returns a a dive with id, classname, and background-color css style set
        <div id={props.id} className="message" style={{backgroundColor: props.color}}>
            <h1 style={{height:"auto"}}>{message}</h1>
        </div>
    );
}

export default Message; // exports the Message component for use