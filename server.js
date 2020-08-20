require('dotenv').config();
const express = require('express');
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;

const authServer = require('./authServer.js')(app);

const server = app.listen(port);
const io = socketIO(server);

console.log(`App is listening on port ${port}`);

/*
SOCKET.IO

SOCKET.IO

SOCKET.IO

SOCKET.IO

SOCKET.IO

SOCKET.IO
*/

const activeUsers = {};
const history = [];

function formatTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'PM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

const authenticateToken = (token, action) => {
  if (token == null) action(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      action(403);
      return;
    }
    action(user.username);
  });
};

io.on('connection', (socket) => {

  const handleLogin = (result) => {
    if (result === 401 || result === 403) {
      socket.emit('error-message', 'Invalid credentials. Please try logging in again.');
      console.log('Bad login attempt.');
      socket.disconnect();

    } else {
      const username = result;
      activeUsers[socket.id] = { name: username };
      socket.emit('login-attempt', username);
      socket.broadcast.emit('user-connected', username);
      socket.emit('active-users', Object.keys(activeUsers).map(id => {
        return { name: activeUsers[id].name, id: id };
      }));
      socket.emit('chat-history', history);
      console.log('Connection and authentication successful!');
    }
  }

  socket.on('login', token => {
    authenticateToken(token, handleLogin);
  
    socket.on('send-chat-message', (message) => {
      if (/^\s*$/.test(message)) return;
      console.log(`${activeUsers[socket.id].name}: ${message}`);
      history.push({
        type: 'chat',
        name: activeUsers[socket.id].name,
        text: message,
        timestamp: formatTime(new Date)
      });
      if (history.length > 20) {
        history.shift();
      }
      io.emit('chat-message', {
        message: message,
        username: activeUsers[socket.id].name,
        timestamp: formatTime(new Date)
      });
    });
  
    socket.on('disconnect', () => {
      if (socket.id in activeUsers) {
        io.emit('user-disconnected', activeUsers[socket.id].name);
        delete activeUsers[socket.id];
      }
    });
  });
});