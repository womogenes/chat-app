import React from 'react';

const ChatMessage = (props) => {
  const { id, name, text, timestamp, displayName } = props;
  if (displayName) {
    const imgURL = `https://api.adorable.io/avatars/40/${name}@adorable.io.png`
    return (
      <>
        <div className='spacer'></div>
        <div className='chat-message' key={id}>
          <div className='pfp-div'>
            <img className='pfp' src={imgURL} alt={`pfp of ${name}`} />
          </div>
          <div className='chat-message-name-timetext'>
            <p className='chat-message-name'>{name}</p>
            <div className='chat-message-timetext'>
              <p className='chat-message-text'>{text}</p>
              <p className='chat-message-time'>{timestamp}</p>
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <div className='chat-message' key={id}>
      <div className='chat-message-timetext-nameless'>
        <p className='chat-message-time'>{timestamp}</p>
        <p className='chat-message-text'>{text}</p>
      </div>
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
                return <ChatMessage key={message.id} name={message.name} text={message.text} timestamp={message.timestamp} displayName={displayName} />
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