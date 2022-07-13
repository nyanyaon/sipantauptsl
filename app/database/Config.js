const sqlite3 = require('sqlite3');
const DB_FILE = __dirname + '/../../data/databases.db';

db = new sqlite3.Database(DB_FILE, sqlite3.OPEN_READWRITE, (err) => {
    if(err) throw err;
});

module.exports = db;