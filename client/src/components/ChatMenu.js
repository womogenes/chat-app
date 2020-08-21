import React from 'react';
import {
  Link
} from 'react-router-dom';

const ChatMenu = () => {

  return (
    <div id='chat-menu'>
      <Link to='/logout'><p>Log out</p></Link>
    </div>
  );
};

export default ChatMenu;