const fs = require('fs');
const path = require('path');
const timer = require('./Timer');
const db = require('./database/Database');
const databases = [];

async function main() {
    let files = fs.readdirSync(path.join(__dirname, "../data"), {withFileTypes: true}).filter(v => !v.isDirectory());

    files.forEach(file => {
        databases.push({ name: file.name.replace(".json", ""), data: require('../data/'+file.name)});
    });

    databases.forEach(data => {
       db.insertInto(data.name, JSON.stringify(data.data), new timer().today().toISOString());
       console.log(data.name + " saved")
    });
}

async function saveDetailDesa() {
    let file = fs.readFileSync(path.join(__dirname, "../data/detaildesalengkap.json"));
    let data = JSON.parse(file);

    db.insertInto("detaildesalengkap", JSON.stringify(data), new timer().today().toISOString());
    console.log("detaildesalengkap saved")
}

module.exports = {
    init: main,
    saveDetailDesa
}