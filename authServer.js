module.exports = (app) => {
  const express = require('express');
  const cors = require('cors');
  const bcrypt = require('bcrypt');
  const fs = require('fs');
  const path = require('path');
  const jwt = require('jsonwebtoken');

  app.use(cors());
  app.use(express.json());

  // Serve the static files from the React app.
  app.use(express.static(path.join(__dirname, '/client/build')));
  app.use(express.static(path.join(__dirname, '/client/public')));
  app.use(express.static(path.join(__dirname, '/')));

  const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2m' });
  };

  // Password system.
  let rawData = fs.readFileSync('./data/users.json');
  const users = JSON.parse(rawData);

  rawData = fs.readFileSync('./data/refreshTokens.json');
  let refreshTokens = JSON.parse(rawData);
  ('refresh tokens: ', refreshTokens);

  app.get('/users', (req, res) => {
    res.json(users);
  });

  app.post('/users', cors(), async (req, res) => {
    console.log('=== ACCOUNT CREATION ATTEMPT ===');
    const username = req.body.username.toLowerCase();
    try {
      for (let i in users) {
        if (users[i].username === username) {
          res.status(400).send('username-exists');
          return;
        }
      }
      // Salt and hash the password.
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = {
        username: username.toLowerCase(),
        password: hashedPassword
      };
      users.push(user);
      const data = JSON.stringify(users, null, 4);
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
    const username = req.body.username.toLowerCase();
    const password = req.body.password;

    const user = users.find(user => user.username === username);
    if (user == null) {
      return res.status(400).send('no-username');
    }
    if (true) { //try {
      if (await bcrypt.compare(password, user.password)) {
        // Correct password!
        const accessToken = generateAccessToken({ name: user.username });
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
        refreshTokens.push(refreshToken);
        const data = JSON.stringify(refreshTokens, null, 4);
        fs.writeFile('./data/refreshTokens.json', data, (err) => {
          if (err) throw err;
          console.log('Refresh tokens file saved.');
        })

        res.json({
          accessToken: accessToken,
          refreshToken: refreshToken
        });

      } else {
        console.log('wrong password');
        res.status(400).send('wrong-password');
      }
    } else { //} catch {
      res.status(500).send();
    }
  });

  app.post('/token', (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (refreshToken == null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken = generateAccessToken({ name: user.username });
      res.json(accessToken);
    });
  });

  app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.refreshToken);
    const data = JSON.stringify(refreshTokens, null, 4);
    fs.writeFile('./data/refreshTokens.json', data, (err) => {
      if (err) throw err;
      console.log('Refresh tokens file saved.');
    })
    res.sendStatus(204);
  });

  // Handles any requests that don't match the ones above
  app.get('*', (req, res) => {
    console.log('uh-oh');
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
  });

}