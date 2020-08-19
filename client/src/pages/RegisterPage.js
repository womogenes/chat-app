import React, {
  useState
} from 'react';
import {
  Link
} from 'react-router-dom';
import axios from 'axios';
import './css/RegisterPage.scss';
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
    return (
      <>
      <p id='success-status'>Account successfully created.</p>
      <Link to='/login'>Click here to sign in.</Link>
      </>
    );
  }
  if (status === 'username-exists') {
    return (
      <p id='username-exists-status'>That username is already taken.<br />Please try a different username.</p>
    );
  }
}

const RegisterPage = () => {
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

  const register = (event) => {
    event.preventDefault();
    if (username === '' || password === '') {
      setStatus('not-submitted');
      return;
    }
    const url = new URL('/users', hostname);
    const data = {
      'username': username,
      'password': password
    };
    axios.post(url, data)
      .then(res => {
        console.log(res);
        setStatus('success');
      })
      .catch(error => {
        console.log(error.response.data);
        setStatus(error.response.data);
      });
  }

  return (
    <div id='register-root'>
      <div id='content-wrapper'>
        <h2 id='header'>Register an Account</h2>
        <p id='desc'>Create an account below.</p>

        <div id='login-link'>
          <Link to='/login'><p>Or, click here to sign in.</p></Link>
        </div>
        
        <div id='register-container'>
          <form id='register-form' onSubmit={register}>
            <label htmlFor='username-input'>
              <FontAwesomeIcon className='FontAwesomeIcon' icon={faUser} /><p>Username</p>
            </label>
            <input id='username-input' onChange={handleUsernameChange} placeholder='Username' />

            <label htmlFor='password-input'>
            <FontAwesomeIcon className='FontAwesomeIcon' icon={faKey} /><p>Password</p>
            </label>
            <input id='password-input' type='password' onChange={handlePasswordChange} placeholder='Password' autoComplete='false' />

            <button id='submit-button'>Register</button>
          </form>
        </div>

        <div id='status-display'>
          <StatusDisplay status={status} />
        </div>
      </div>
    </div>
  )
}

export default RegisterPage;