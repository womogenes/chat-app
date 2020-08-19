require('dotenv').config();
const express = require('express');
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5001;
const server = app.listen(port);
const io = socketIO(server);

console.log(`App is listening on port ${port}`);

const activeUsers = {};

const authenticateToken = (token, action) => {
  if (token == null) action(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) action(403);
    action(user);
  });
};

io.on('connection', (socket) => {

  socket.on('login', async token => {
    let result = null;
    const setResult = (x) => {
      result = x;
    }
    await authenticateToken(token, setResult);
    if (result === 401 || result === 403) {
      socket.emit('login-attempt', 'bad-token');
      console.log('Bad login attempt.');
      return;
    }
    const username = result.username;
    activeUsers[socket.id] = { name: username };
    socket.emit('login-attempt', `You have joined. (Username ${username}.)`);
    socket.broadcast.emit('user-connected', username);
  
    socket.on('send-chat-message', (message) => {
      if (/^\s*$/.test(message)) return;
      console.log(`${activeUsers[socket.id].name}: ${message}`);
      io.emit('chat-message', {message: message, username: activeUsers[socket.id].name});
    });
  
    socket.on('disconnect', () => {
      io.emit('user-disconnected', activeUsers[socket.id].name);
      delete activeUsers[socket.id];
    });
  });
});