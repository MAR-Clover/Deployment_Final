const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

const SECRET = "supersecretkey";

// Register route
router.post('/register', (req, res) => {
  const { email, password } = req.body;
  const hashed = bcrypt.hashSync(password, 10);

  db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, hashed], function(err) {
    if (err) {
      return res.status(400).json({ error: 'User exists or DB error' });
    }
    res.json({ message: 'User registered' });
  });
});

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});


module.exports = router;
