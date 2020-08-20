require('dotenv').config();
const express = require('express');
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
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
  if (true) { //try {
    if (await bcrypt.compare(password, user.password)) {
      // Correct password!
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.json({ accessToken: accessToken });

    } else {
      console.log('wrong password');
      res.status(400).send('wrong-password');
    }
  } else { //} catch {
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
  var ampm = hours >= 12 ? 'PM' : 'PN';
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
      socket.emit('login-attempt', `You have joined. (Username ${username}.)`);
      socket.broadcast.emit('user-connected', username);
      socket.emit('chat-history', history);
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