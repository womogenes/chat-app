import React, {
  useState,
  useEffect,
  useRef
} from 'react';
import socketIO from 'socket.io-client';
import './ChatPage.css';
import ChatMessageList from './ChatMessage.js';
import SendForm from './SendForm.js';

const ENDPOINT;
if (!process.env.NODE_ENV || process.env.NODE_ENV == 'development') {
  ENDPOINT = 'http://localhost:5000';
} else {
  ENDPOINT = '/';
}
const io = socketIO(ENDPOINT);

let id = 0;
let name = '';
if (/^\s*$/.test(name)) name = 'Anonymous';

const ChatPage = () => {

  const [messages, setMessages] = useState([]);
  
  const messagesRef = useRef();
  messagesRef.current = messages;
  
  // Add a new message handle.
  const addNewMessage = (type, name, text) => {
    id++;
    const newMessage = {
      type: type,
      name: name,
      text: text,
      id: id
    };
    setMessages([...messagesRef.current, newMessage]);
  };
  
  const setIO = () => {
    io.emit('new-user', name);
    addNewMessage('info', '', `${name} has joined.`);
    io.on('user-connected', name => addNewMessage('info', '', `${name} has connected.`));
    io.on('chat-message', data => addNewMessage('message', data.name, data.message));
  }
  
  const onSendMessage = (message) => {
    addNewMessage('message', name, message);
    io.emit('send-chat-message', message);
  }
  
  useEffect(setIO, []);
  
  return (
    <div id='chat-root'>
      <div id='header'><h2>Chat App</h2></div>
      <ChatMessageList messages={messages} />
      <SendForm submitAction={onSendMessage} />
    </div>
  );
};

export default ChatPage;