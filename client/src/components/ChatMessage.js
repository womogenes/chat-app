import React from 'react';

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

export default ChatMessageList;