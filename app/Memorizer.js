const fs = require('fs');
const path = require('path');
const today = new Date();
const yesterday = new Date(Date.now() - 864e5);
const third = new Date(Date.now() - 2*24*60*60*1000);
const todayLocal = `${today.getDay()}${today.getMonth()}${today.getFullYear()}`;
const yesterdayLocal = `${yesterday.getDay()}${yesterday.getMonth()}${yesterday.getFullYear()}`;
const thirddayLocal = `${third.getDay()}${third.getMonth()}${third.getFullYear()}`;

async function main() {
    console.log(today);
    console.log(yesterday);
    file = fs.statSync(path.join(__dirname, "../data/peringkat.json"));
    backup();
}

function backup() {
    fs.readdir(path.join(__dirname, '../data'), {withFileTypes: true}, (err, files) => {
        if(err) {
            throw Error(err.message);
        }

        files.forEach(file => {
            if(file.isDirectory()) {
                return;
            }
            console.log(file);
            fs.copyFile(path.join(__dirname, '../data/'+file.name), path.join(__dirname, '../data/old/'+file.name), fs.constants.COPYFILE_EXCL,(err) => {
                if(err) {
                    console.log(err.message);
                } else {
                    console.log("Berhasil membackup")
                }
            });
        })
    });
}

function createTemp() {
    if(fs.statSync(path.join(__dirname, '../data/old/peringkat')).ctime) {

    }
}

main();