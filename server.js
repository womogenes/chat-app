const express = require('express');
const cors = require('cors');
const fs = require('fs');
const socketIO = require('socket.io');
const path = require('path');
const bcrypt = require('bcrypt');
const { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } = require('constants');

const app = express();
app.use(cors());
app.use(express.json());

// Serve the static files from the React app.
app.use(express.static(path.join(__dirname, '/client/build')));
app.use(express.static(path.join(__dirname, '/client/public')));
app.use(express.static(path.join(__dirname, '/')));

// Password system.
const rawData = fs.readFileSync('./data/users.json');
const users = JSON.parse(rawData);

app.post('/users', cors(), async (req, res) => {
  console.log('=== ACCOUNT CREATION ATTEMPT ===');
  try {
    for (let i in users) {
      if (users[i].name === req.body.name) {
        res.status(400).send('username-exists');
        return;
      }
    }
    // Salt and hash the password.
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      name: req.body.name,
      password: hashedPassword
    };
    users.push(user);
    const data = JSON.stringify(users, null, 2);
    fs.writeFile('./data/users.json', data, (err) => {
      if (err) throw err;
      console.log('Users file saved.');
    })
    res.status(201).send();
    
  } catch {
    res.status(500).send();
  }
});

app.post('/users/login', cors(),  async (req, res) => {
  console.log('=== LOGIN ATTEMPT ===');
  console.log(req.body.name);
  console.log(req.body.password);
  const user = users.find(user => user.name === req.body.name);
  if (user == null) {
    return res.status(400).send('no-username');
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send('success');
    } else {
      res.status(400).send('wrong-password');
    }
  } catch {
    res.status(500).send();
  }
});

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  console.log('uh-oh');
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 5000;
const server = app.listen(port);

console.log(`App is listening on port ${port}`);

const activeUsers = {};

// Handle socket.io stuff!
const io = socketIO(server);

io.on('connection', (socket) => {
  socket.on('new-user', (name) => {
    activeUsers[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
  });
  socket.on('send-chat-message', (message) => {
    console.log(`${activeUsers[socket.id]}: ${message}`);
    socket.broadcast.emit('chat-message', {message: message, name: activeUsers[socket.id]});
  });
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', activeUsers[socket.id]);
    delete activeUsers[socket.id];
  });
});