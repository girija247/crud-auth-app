 const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Show register form
router.get('/register', (req, res) => {
  res.render('register');
});

// Show login form
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle registration
router.post('/register', async (req, res) => {
  try {
    await User.create(req.body);
    res.redirect('/login');
  } catch (err) {
    res.send('Registration error: ' + err.message);
  }
});

// Handle login
router.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user && await bcrypt.compare(req.body.password, user.password)) {
    req.session.userId = user._id;
    res.redirect('/dashboard');
  } else {
    res.send('Invalid username or password');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;

