require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const socketIO = require('socket.io');
const path = require('path');
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
console.log(`App is listening on port ${port}`);

app.listen(port);