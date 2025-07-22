const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
const authRoutes = require("./routes/auth")
require('dotenv').config();


app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes)

const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET || 'fallbacksecret';

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
}

  app.post('/appointments', verifyToken, (req, res) => {
    const { time } = req.body;
    db.run(`INSERT INTO appointments (user_id, time_slot) VALUES (?, ?)`, [req.userId, time], function(err) {
      if (err) return res.status(500).send("Error booking appointment");
      res.status(200).json({ id: this.lastID });
    });
  });

  app.get('/appointments', verifyToken, (req, res) => {
    db.all(`SELECT * FROM appointments WHERE user_id = ? ORDER BY time_slot ASC`,
      [req.userId],
      (err,rows) => {
        if (err) return res.status(500).json({ error: 'Database error' })
          res.json(rows)
      } 
    );
  });

  app.delete('/appointments/:id', verifyToken, (req,res)=>{
    const appointmentId = req.params.id
    const userId = req.userId
    
    console.log('Deleting appointmnent ID:', appointmentId, 'for user id:', userId)
    db.all('SELECT * FROM appointments', (err, rows) => {
      if(!err) console.log('Current appointments:', rows)
    })

    db.run(
      `DELETE FROM appointments WHERE id = ? AND user_id = ?`,
      [appointmentId, userId],
      function (err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to delete appointment' });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Appointment not found or unauthorized' });
        }
        res.json({ message: 'Appointment deleted successfully' });
      }
    );
    
  })

  // app.put('/appointments/:id', verifyToken, (req, res) => {
  //   const appointmentId = req.params.id;
  //   const { time_slot } = req.body;

  //   db.run(
  //     `UPDATE appointments SET time_slot = ? WHERE id = ? AND user_id = ?`,
  //     [time_slot, appointmentId, req.userId],
  //     function (err) {
  //       if (err) {
  //         return res.status(500).json({ error: 'Failed to update appointment' });
  //       }
  //       if (this.changes === 0) {
  //         return res.status(404).json({ error: 'Appointment not found or unauthorized' });
  //       }
  //       res.json({ message: 'Appointment updated successfully' });
  //     }
  //   );
  // });

  app.put('/appointments/:id', verifyToken, (req, res) => {
    const appointmentId = req.params.id;
    const { time_slot } = req.body;
    
    console.log(`PUT /appointments/${appointmentId} - user ${req.userId} updating time_slot to:`, time_slot);
  
    if (!time_slot) {
      return res.status(400).json({ error: 'time_slot is required' });
    }
  
    db.run(
      `UPDATE appointments SET time_slot = ? WHERE id = ? AND user_id = ?`,
      [time_slot, appointmentId, req.userId],
      function (err) {
        if (err) {
          console.error('DB error:', err);
          return res.status(500).json({ error: 'Failed to update appointment' });
        }
        if (this.changes === 0) {
          console.log('No rows updated - appointment not found or unauthorized');
          return res.status(404).json({ error: 'Appointment not found or unauthorized' });
        }
        res.json({ message: 'Appointment updated successfully' });
      }
    );
  });
  


module.exports = app;

