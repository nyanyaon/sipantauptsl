const db = require('./Config');

function getAll(tablename, callback) { 
    var data = [];

    db.all(`SELECT * FROM ${tablename}`, (err, row) => {
        if(err) console.log(err);
        callback(row);
    });
}

function insertInto(name, data, time) {
    db.serialize(() => {
        const stmt = db.prepare(`INSERT INTO ${name} VALUES (?, ?)`);
        stmt.run([data, time]);
        stmt.finalize();
    });
}

function insertDaftarNDL(desa, ndlhilang) {
    db.serialize(() => {
        const stmt = db.prepare(`INSERT INTO daftarndl VALUES (?, ?)`);
        stmt.run([desa, ndlhilang]);
        stmt.finalize();
    });
}

function updateDaftarNDL(desa, ndlhilang) {
    db.serialize(() => {
        db.run(`UPDATE daftarndl SET ndlhilang = ${ndlhilang} WHERE desa = ?`, desa);
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
    conn: db,
    closeConn,
    createTable,
    deleteTable,
    insertInto,
    getAll,
    insertDaftarNDL,
    updateDaftarNDL
}
