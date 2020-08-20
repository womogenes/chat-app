import React, {
  useState,
  useEffect,
  useRef
} from 'react';
import {
  Link
} from 'react-router-dom';
import socketIO from 'socket.io-client';
import './css/ChatPage.scss';
import ChatMessageList from '../components/ChatMessage.js';
import SendForm from '../components/SendForm.js';

let ENDPOINT = null;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  ENDPOINT = 'http://localhost:5000';
} else {
  ENDPOINT = '/';
}
const io = socketIO(ENDPOINT);

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  
  const authToken = localStorage.getItem('authToken');
  
  const messagesRef = useRef();
  messagesRef.current = messages;

  console.log(messagesRef.current);
  
  // Add a new message handle.
  const addHistory = (history) => {
    const existingLength = messagesRef.current.length;
    setMessages(
      messagesRef.current.concat(
        history.map((message, index) => {
          return {
            ...message,
            id: index + existingLength
          };
        })
      )
    );
    console.log(history);
  };
  const addInfoMessage = (text) => {
    const newMessage = {
      type: 'info',
      text: text,
      id: messagesRef.current.length
    };
    setMessages([...messagesRef.current, newMessage]);
  };
  const addErrorMessage = (error) => {
    const newMessage = {
      type: 'error',
      text: error,
      id: messagesRef.current.length
    };
    setMessages([...messagesRef.current, newMessage]);
  };
  const addChatMessage = (name, text, timestamp) => {
    const newMessage = {
      type: 'chat',
      name: name,
      text: text,
      timestamp: timestamp,
      id: messagesRef.current.length
    };
    setMessages([...messagesRef.current, newMessage]);
  };
  
  const setIO = () => {
    if (authToken != null) {
      io.emit('login', authToken);
      addInfoMessage('Awaiting response from server...');
    }

    io.on('chat-history', history => addHistory(history));

    io.on('error-message', error => addErrorMessage(error));

    io.on('user-connected', name => addInfoMessage(`${name} has connected.`));

    io.on('chat-message', data => {
      addChatMessage(data.username, data.message, data.timestamp)
    });

    io.on('login-attempt', data => addInfoMessage(data));

    return () => {
      io.close();
    }
  }
  
  const onSendMessage = (message) => {
    //if (/^\s*$/.test(message)) return;
    io.emit('send-chat-message', message);
  }
  
  useEffect(setIO, []);
  
  if (authToken == null) {
    return (
      <div id='chat-root'>
        <div id='header'><h2>Chat App</h2></div>
        <div id='no-token'>
          <p>
            You are not logged in.<br />
            Please <Link to='/login'>log in here</Link>
            {' '}to access the app.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id='chat-root'>
      <div id='header'><h2>Chat Lobby</h2></div>
      <div id='chat-wrapper'>
        <ChatMessageList messages={messages} />
        <SendForm submitAction={onSendMessage} />
      </div>
    </div>
  );
};

export default ChatPage;