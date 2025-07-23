const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Use RENDER_DATA_DIR if set, otherwise fallback to /tmp (for local/dev)
const dir = process.env.RENDER_DATA_DIR || '/tmp';

// Ensure the directory exists
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const dbPath = path.join(dir, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to DB:', err.message);
  } else {
    console.log('Connected to DB at', dbPath);
  }
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    time_slot TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

module.exports = db;
