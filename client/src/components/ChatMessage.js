import React from 'react';

const ChatMessage = (props) => {
  const { displayName } = props;
  if (displayName) {
    return (
      <div className='chat-message' key={props.id}>
        <p className='chat-message-name'>{props.name}</p><br />
        <p className='chat-message-text'>{props.text}</p>
      </div>
    );
  }
  return (
    <div className='chat-message' key={props.id}>
      <p className='chat-message-text'>{props.text}</p>
    </div>
  );
}

const ErrorMessage = (props) => {
  return (
    <div className='error-message'>
      <p>{props.text}</p>
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
            messages.map((message, index) => {
              if (message.type === 'error') {
                return <ErrorMessage key={message.id} text={message.text} />
              }
              if (message.type === 'info') {
                return <InfoMessage key={message.id} text={message.text} />
              }
              if (message.type === 'chat') {
                const displayName = message.id === 0 || messages[index - 1].name !== message.name;
                return <ChatMessage key={message.id} name={message.name} text={message.text} displayName={displayName} />
              }
              return null;
            })
          }
        </div>
      </div>
    </div>
  );
}

export default ChatMessageList;