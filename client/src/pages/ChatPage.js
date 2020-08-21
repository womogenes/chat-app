import React, {
  useState,
  useEffect,
  useRef
} from 'react';
import {
  Link
} from 'react-router-dom';
import axios from 'axios';
import socketIO from 'socket.io-client';
import './css/ChatPage.scss';
import ChatMessageList from '../components/ChatMessage.js';
import SendForm from '../components/SendForm.js';
import ActiveUserList from '../components/ActiveUserList.js';

let ENDPOINT = null;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  ENDPOINT = 'http://localhost:5000';
} else {
  ENDPOINT = window.location.origin;
}
const io = socketIO(ENDPOINT);

let myUsername = null;

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const messagesRef = useRef();
  messagesRef.current = messages;
  const activeUsersRef = useRef();
  activeUsersRef.current = activeUsers;
  let accessToken = localStorage.getItem('accessToken');

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
    if (accessToken != null) {
      io.emit('login', accessToken);
      addInfoMessage('Awaiting response from server...');
    }

    io.on('active-users', users => setActiveUsers(users));

    io.on('chat-history', history => addHistory(history));

    io.on('error-message', error => addErrorMessage(error));

    io.on('user-connected', user => {
      addInfoMessage(`${user.name} has connected.`);
      setActiveUsers([...activeUsersRef.current, { name: user.name, id: user.id }]);
    });

    io.on('user-disconnected', user => {
      addInfoMessage(`${user.name} has disconnected.`);
      setActiveUsers(activeUsersRef.current.filter(u => (user.name !== u.name || user.id !== u.id)));
    })

    io.on('chat-message', data => {
      addChatMessage(data.username, data.message, data.timestamp);
    });

    io.on('login-attempt', data => {
      if (data[0] === 403 || data[0] === 401) {
        setTimeout(() => {
          const data = {
            refreshToken: localStorage.getItem('refreshToken')
          };
          axios.post(new URL('/token', ENDPOINT), data)
            .then(res => {
              console.log(res);
              localStorage.setItem('accessToken', res.data);
              io.emit('login', res.data);
            })
            .catch(error => {
              if (!error.response || error.response.status === 403 || error.response.status === 401) {
                addErrorMessage('An error occured with authentication. Please try logging in again.');
              }
            });
        }, 100);
        return;
      }
      console.log(data);
      myUsername = data[1];
      addInfoMessage(`You have joined. (Username ${myUsername})`);
    });
  }
  
  const onSendMessage = (message) => {
    //if (/^\s*$/.test(message)) return;
    io.emit('send-chat-message', message);
    console.log('emit emit');
  }
  
  useEffect(setIO, []);
  
  if (accessToken == null) {
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
      <div id='header'>
        <h2>Chat Lobby</h2>
      </div>
      <div id='content-wrapper'>
        <div id='chat-wrapper'>
          <ChatMessageList messages={messages} />
          <SendForm submitAction={onSendMessage} />
        </div>
        <div id='active-user-list-wrapper'>
          <ActiveUserList activeUsers={activeUsers} self={{
            username: myUsername,
            id: io.id
          }} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;