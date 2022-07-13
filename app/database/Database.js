const db = require('./Config');

let sql = `
    SELECT * FROM desalengkap
`
db.run(sql, (err, result) => {
    if(err) throw err;

    console.log(result);
});

db.close();