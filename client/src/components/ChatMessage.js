import React, { useState } from 'react';

const ChatMessage = (props) => {
  return (
    <div className='chat-message' key={props.id}>
      <p className='chat-message-name'>{`${props.name}:`}</p>
      <p className='chat-message-text'>{`\xa0${props.text}`}</p>
    </div>
  );
}

const InfoMessage = (props) => {
  return (
    <div className='info-message'>
      <p>{props.text}</p>
    </div>
  );
}

const SendForm = (props) => {
  const [newMessage, setNewMessage] = useState('');
  
  const handleMessageChange = (event) => {
    setNewMessage(event.target.value);
  }
  
  const submitAction = (event) => {
    event.preventDefault();
    // if (/^\s*$/.test(newMessage)) return;
    props.submitAction(newMessage);
    setNewMessage('');
  }
  
  return (
    <form id="send-container" onSubmit={submitAction}>
      <input id='message-input' value={newMessage} onChange={handleMessageChange} />
      <button id='send-button'>Send</button>
    </form>
  );
}

const ChatMessageList = (props) => {
  const { messages } = props;
  
  return (
    <div id="message-container">
      {
        messages.map(message => {
          if (message.type === 'info') {
            return <InfoMessage key={message.id} text={message.text} />
          } else {
            return <ChatMessage key={message.id} name={message.name} text={message.text} />
          }
        })
      }
    </div>
  );
}

export { ChatMessageList };
export { SendForm };