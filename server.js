const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));
app.use(express.static(path.join(__dirname, '/client/public')));
app.use(express.static(path.join(__dirname, '/')));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 5000;
const server = app.listen(port);

console.log(`App is listening on port ${port}`);

const users = {};

// Handle socket.io stuff!
const io = socketIO(server);

io.on('connection', (socket) => {
  socket.on('new-user', (name) => {
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
  });
  socket.on('send-chat-message', (message) => {
    socket.broadcast.emit('chat-message', {message: message, name: users[socket.id]});
  });
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
  });
});