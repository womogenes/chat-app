require('dotenv').config();
const express = require('express');
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
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

app.get('/users', (req, res) => {
  res.json(users);
});

app.post('/users', cors(), async (req, res) => {
  console.log('=== ACCOUNT CREATION ATTEMPT ===');
  try {
    for (let i in users) {
      if (users[i].username === req.body.username) {
        res.status(400).send('username-exists');
        return;
      }
    }
    // Salt and hash the password.
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      username: req.body.username,
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

app.post('/users/login', cors(), async (req, res) => {
  console.log('=== LOGIN ATTEMPT ===');
  const username = req.body.username;
  const password = req.body.password;

  const user = users.find(user => user.username === username);
  if (user == null) {
    return res.status(400).send('no-username');
  }
  try {
    if (await bcrypt.compare(password, user.password)) {
      // Correct password!
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.json({ accessToken: accessToken });

    } else {
      console.log('wrong password');
      res.status(400).send('wrong-password');
    }
  } catch {
    res.status(500).send();
  }
});

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  console.log('uh-oh');
  res.sendFile(path.join(__dirusername + '/client/build/index.html'));
});

const port = process.env.PORT || 5000;

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