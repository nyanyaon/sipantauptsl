const db = require('./Config');

function getAll(tablename) { 
    db.all(`SELECT * FROM ${tablename}`, (err, row) => {
        if(err) console.log(err)
        return row;
    });

    db.close();
}

function insertDesaLengkap(data) {
    db.serialize(() => {
        const stmt = db.prepare("INSERT INTO desalengkap VALUES (?, ?, ?)");
        stmt.run([null, data, time]);
        stmt.finalize();
    });

    db.close();
}

function insertInto(name, data, time) {
    db.serialize(() => {
        const stmt = db.prepare(`INSERT INTO ${name} VALUES (?, ?)`);
        stmt.run([data, time]);
        stmt.finalize();
    });
}

function createTable(tablename) {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS ${tablename} (
            data TEXT,
            time TEXT
        )`);
        
        console.log("Success create table " + tablename);
    });
}

function deleteTable(tablename) {
    db.serialize(() => {
        db.run(`DROP TABLE IF EXISTS ${tablename}`);
        
        console.log("Success delete table " + tablename);
    });

    db.close();
}

function closeConn() {
    db.close();
}


module.exports = {
    closeConn,
    createTable,
    deleteTable,
    insertInto,
    getAll
}
