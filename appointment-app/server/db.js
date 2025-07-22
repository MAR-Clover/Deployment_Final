const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); //credentials and appointments are stored in memory so it will disapear when server is restarted

db.serialize(() => {
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    password TEXT
  )`);

  db.run(`CREATE TABLE appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    time_slot TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

module.exports = db;