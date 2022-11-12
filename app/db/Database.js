const mongoDB = require('mongodb');

class Database {
    _dbname = "spanptsl";

    async connect() {
        const client = new mongoDB.MongoClient("mongodb://root:12345@nyanyaon.my.id/");

        await client.connect();

        const db = client.db(this._dbname);

        this._db = db;
    }

    getCollection(name) {
        return this._db.collection(name);
    }
}

module.exports = Database;