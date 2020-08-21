require('dotenv').config();
const express = require('express');
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;

require('./authServer.js')(app);

const server = app.listen(port);
const io = socketIO(server);

console.log(`App is listening on port ${port}`);

const activeUsers = {};
const history = [];

const formatTime = (date) => {
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
  if (token == null) {
    action(401);
  };
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      action(403);
      return;
    }
    action(user.name);
  });
};

io.on('connection', (socket) => {

  for (i in activeUsers) {
    if (i === socket.id) return;
  }

  const handleLogin = (result) => {
    if (result === 401 || result === 403) {
      socket.emit('login-attempt', [result, 'invalid-token']);
      console.log('Bad login attempt.');

    } else {
      const username = result;
      activeUsers[socket.id] = { name: username };
      socket.emit('login-attempt', [200, username]);
      socket.broadcast.emit('user-connected', [username, socket.id]);
      socket.emit('active-users', Object.keys(activeUsers).map(id => {
        return { name: activeUsers[id].name, id: id };
      }));
      socket.emit('chat-history', history);
      console.log('Connection and authentication successful!');

      startClientListening();
    }
  };

  socket.on('login', token => {
    authenticateToken(token, handleLogin);  
  });

  const startClientListening = () => {
    socket.on('send-chat-message', (message) => {
      if (/^\s*$/.test(message)) return;
      console.log(`${socket.id}, ${activeUsers[socket.id].name}: ${message}`);
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
        io.emit('user-disconnected', (activeUsers[socket.id].name, socket.id));
        delete activeUsers[socket.id];
      }
    });
  };
});