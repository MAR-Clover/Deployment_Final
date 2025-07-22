const sqlite3 = require('sqlite3').verbose();

// Use environment variable if set, otherwise default to local file
const dbPath = process.env.DB_FILE || './database.sqlite';

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to DB:', err.message);
  } else {
    console.log(`Connected to SQLite database at ${dbPath}`);
  }
});

// Create tables if they don't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      time_slot TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);
});

module.exports = db;
