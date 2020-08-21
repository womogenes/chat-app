import React, {
  useState,
  useEffect
} from 'react';
import {
  Link
} from 'react-router-dom';
import './css/LogoutPage.scss';
import axios from 'axios';

const StatusDisplay = (props) => {
  const { status } = props;

  if (status === 'logging-out') {
    return (
      <p>Logging out...</p>
    );
  }
  if (status === 'logged-out') {
    return (
      <>
      <p>Logged out successfully.</p>
      <Link to='/login'>Click here to log back in.</Link>
      </>
    );
  }
  if (status === 'server-error') {
    return (
      <p>Server error. :(</p>
    );
  }
  return null;
}

const LogoutPage = () => {
  const [ status, setStatus ] = useState('logging-out');

  let hostname = null;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    hostname = 'http://localhost:5000';
  } else {
    hostname = window.location.origin;
  }

  const logOut = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');    
    const data = {
      refreshToken: localStorage.getItem('refreshToken')
    };
    axios.delete(new URL('/logout', hostname), data)
      .then(res => {
        if (res.status === 204) {
          setStatus('logged-out');
        } else if (res.status === 500) {
          setStatus('server-error');
        }
      })
      .catch(error => {
        setStatus('server-error');
      });
  };

  useEffect(logOut, []);

  return (
    <div id='logout-root'>
      <div id='logout-wrapper'>
        <div id='logout-content'>
          <StatusDisplay status={status} />
        </div>
      </div>
    </div>
  )
};

export default LogoutPage;