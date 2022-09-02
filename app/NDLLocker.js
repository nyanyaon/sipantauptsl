const timer = require('./Timer');
const db = require('./database/Database');
const wa = require('./bot/WA');
const fs = require('fs');
const path = require('path');

async function getDesaNDL() {
    const conn = db.conn;
    const DETAILDESA = [];

    let data = new Promise(function (resolve, reject) {
        conn.serialize(function () {
            conn.each("SELECT * FROM detaildesalengkap", function (err, row) {
                DETAILDESA.push(row); //pushing rows into array
            }, function () {
                resolve(true); // calling function when all rows have been pulled
            });//closing connection
        });
    });

    await data;

    let todayData = DETAILDESA.filter(o => {
        let dataDate = new Date(o.time);
        return dataDate.toLocaleDateString() == new timer().today().toLocaleDateString();
    });

    todayData = todayData[todayData.length - 1];

    if (todayData == null) {
        console.log("No data found");
        return 1;
    }

    let todayDetailDesa = JSON.parse(todayData.data);

    const DAFTARNDL = [];

    let getDaftarNDL = new Promise(function (resolve, reject) {
        conn.serialize(function () {
            conn.each("SELECT * FROM daftarndl", function (err, row) {
                DAFTARNDL.push(row); //pushing rows into array
            }, function () {
                resolve(true); // calling function when all rows have been pulled
            });//closing connection
        });
    });

    await getDaftarNDL;
    const sudahndl = todayDetailDesa.filter((detail, index) => detail.NDL > 0 && todayDetailDesa.findIndex(d => d.desa === detail.desa) === index);

    for (let sudah of sudahndl) {
        if (DAFTARNDL.find((daftar) => daftar.desa === sudah.desa)) {
            db.updateDaftarNDL(sudah.desa, false);
            DAFTARNDL.splice(DAFTARNDL.findIndex(val => val.desa === sudah.desa), 1);
            continue;
        }

        db.insertDaftarNDL(sudah.desa, false);
    }

    DAFTARNDL.forEach(val => {
        db.updateDaftarNDL(val.desa, true);
    });

    if (DAFTARNDL.length > 0) {
        wa.LIST_CONTACT.forEach(kontak => {
            wa.client.sendMessage(kontak,
                "⚠️ Berikut kami sampaikan desa yang perlu dilakukan *maintenance* :\n" +
                DAFTARNDL.map((val, index) => `${index + 1}. ${val.desa}`).join("\n") +
                "\nMOHON SEGERA DITINDAKLANJUTI, Terimakasih 🙏"
            );
        });
    }
}

async function getDesaNDLJSON(number) {
    let todayData = fs.readFileSync(path.join(__dirname, '../data/detaildesalengkap.json'));
    let todayDetailDesa = JSON.parse(todayData);

    const conn = db.conn;
    const DAFTARNDL = [];

    let getDaftarNDL = new Promise(function (resolve, reject) {
        conn.serialize(function () {
            conn.each("SELECT * FROM daftarndl", function (err, row) {
                DAFTARNDL.push(row); //pushing rows into array
            }, function () {
                resolve(true); // calling function when all rows have been pulled
            });//closing connection
        });
    });

    await getDaftarNDL

    const sudahndl = todayDetailDesa.filter((detail, index) => detail.NDL > 0 && todayDetailDesa.findIndex(d => d.desa === detail.desa) === index);

    sudahndl.forEach((sudah, index) => {
        if (DAFTARNDL.find((daftar) => daftar.desa === sudah.desa)) {
            db.updateDaftarNDL(sudah.desa, false);
            DAFTARNDL.splice(DAFTARNDL.findIndex(val => val.desa === sudah.desa), 1);
            return;
        }

        db.insertDaftarNDL(sudah.desa, false);
    });

    DAFTARNDL.forEach(val => {
        db.updateDaftarNDL(val.desa, true);
    });

    if (DAFTARNDL.length > 0) {
        wa.client.sendMessage(number,
            "⚠️ Berikut kami sampaikan desa yang perlu dilakukan *maintenance* :\n" +
            DAFTARNDL.map((val, index) => `${index + 1}. ${val.desa}`).join("\n") +
            "\nMOHON SEGERA DITINDAKLANJUTI, Terimakasih 🙏"
        );
    } else {
        wa.client.sendMessage(number,
            "Tidak ada desa yang perlu di maintenance 🥳🥳👍👍"
        );
    }
}

module.exports = {
    getDesaNDL,
    getDesaNDLJSON
}


