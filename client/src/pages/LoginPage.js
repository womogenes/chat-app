import React, {
  useState
} from 'react';
import {
  Link,
  Redirect
} from 'react-router-dom';
import axios from 'axios';
import './css/LoginPage.scss';
import {
  faUser,
  faKey
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StatusDisplay = (props) => {
  const { status } = props;

  if (status === 'not-submitted') {
    return <p></p>;
  }
  if (status === 'success') {
    return <p id='success-status'>Success!</p>
  }
  if (status === 'no-username') {
    return (
      <p id='no-username-status'>That username does not exist.</p>
    );
  }
  if (status === 'wrong-password') {
    return (
      <p id='wrong-password-status'>Incorrect password.</p>
    );
  }
  return null;
}

const LoginPage = (props) => {
  const { setAuthToken } = props;

  const [status, setStatus] = useState('not-submitted');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => { setUsername(event.target.value) };
  const handlePasswordChange = (event) => { setPassword(event.target.value) };

  let hostname = null;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    hostname = 'http://localhost:5000';
  } else {
    hostname = window.location.origin;
  }
  console.log(hostname);

  const logIn = (event) => {
    event.preventDefault();
    if (username === '' || password === '') {
      setStatus('not-submitted');
      return;
    }
    const url = new URL('/users/login', hostname);
    const data = {
      'username': username,
      'password': password
    };
    axios.post(url, data)
      .then(res => {
        console.log(res);
        const token = res.data.accessToken;
        setAuthToken(token);
        setStatus('success');
      })
      .catch(error => {
        console.log(error.response.data);
        setStatus(error.response.data);
      });
  }

  if (localStorage.getItem('authToken') != null) {
    return (
      <Redirect to='/chat' />
    )
  }

  return (
    <div id='login-root'>
      <div id='content-wrapper'>
        <h2 id='header'>Chat App Login</h2>
        <p id='desc'>I tried using OAuth but it was too complicated.
          So intead, here I'm using the more standard but just as 
          secure option. Your password is salted and hashed, just 
          like any other secure password system.</p>
        
        <div id='register-link'>
          <Link to='/register'><p>Don't have an account? Register here.</p></Link>
        </div>

        <div id='login-container'>
          <form id='login-form' onSubmit={logIn}>
            <label htmlFor='username-input'>
              <FontAwesomeIcon className='FontAwesomeIcon' icon={faUser} /><p>Username</p>
            </label>
            <input id='username-input' onChange={handleUsernameChange} placeholder='Username' />

            <label htmlFor='password-input'>
            <FontAwesomeIcon className='FontAwesomeIcon' icon={faKey} /><p>Password</p>
            </label>
            <input id='password-input' type='password' onChange={handlePasswordChange} placeholder='Password' autoComplete='false' />

            <button id='submit-button'>Login</button>
          </form>
        </div>

        <div id='status-display'>
          <StatusDisplay status={status} />
        </div>
      </div>
    </div>
  )
}

export default LoginPage;