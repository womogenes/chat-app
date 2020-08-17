import React from 'react';

const LoginPage = (props) => {

  return (
    <div id='login-root'>
      <h2 id='header'>Chat App Login</h2>
      <p>This app uses OAuth so that we don't have to muck around with password storage.</p>
      <p>Plus, it's much more secure.</p>
    </div>
  )
}

export { LoginPage };