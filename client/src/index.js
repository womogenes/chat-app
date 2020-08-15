import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import socketIO from 'socket.io-client';

const ENDPOINT = '/';
const io = socketIO(ENDPOINT);

ReactDOM.render(
  <React.StrictMode>
    <App io={io} />
  </React.StrictMode>,
  document.getElementById('root')
);