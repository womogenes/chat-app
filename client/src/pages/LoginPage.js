import React, {
  FC,
  useState,
  useEffect,
  useCallback
} from 'react';
import './LoginPage.css';
import { Card, Button } from '@material-ui/core';
import styled from '@emotion/styled';
import { Google } from './config.js';

const StyledCard = styled(Card)`
  padding: 20px;
  margin: 100px auto;
  max-width: 40vw;
  min-width: 300px;
`;

const LoginPage = (props) => {

  return (
    <div id='login-root'>
      <h2 id='header'>Chat App Login</h2>
      <p>This app uses OAuth so that we don't have to muck around with password storage. </p>
      <p>Plus, it's much more secure.</p>
      <br /><br />
    </div>
  )
}

export default LoginPage;