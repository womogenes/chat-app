import React, { useState, useEffect, createRef } from 'react';

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
  const messageInput = createRef();
  
  useEffect(() => {
    messageInput.current.focus();
  }, [messageInput]);
  
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
    <form id="send-container"
      onSubmit={submitAction}
      autoComplete="off"
    >
      <input id='message-input'
        ref={messageInput}
        value={newMessage}
        onChange={handleMessageChange}
      />
      <button id='send-button'>Send</button>
    </form>
  );
}

const ChatMessageList = (props) => {
  const { messages } = props;
  
  return (
    <div id='message-wrapper'>
      <div id='message-container'>
        <div id='message-content'>
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
      </div>
    </div>
  );
}

export { ChatMessageList };
export { SendForm };