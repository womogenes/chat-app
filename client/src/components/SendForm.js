import React, {
  useState,
  useEffect,
  createRef
} from 'react';

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

export default SendForm;