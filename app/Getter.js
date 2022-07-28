const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");


async function startPuppeter(headless = false) {
    const browser = await puppeteer.launch({
        headless: headless
    });
    const page = await browser.newPage();

    await page.goto("https://kkp2.atrbpn.go.id/");
    await page.type("input#lg_username", "198408222009031003");
    await page.type("input#inputPassword", "ABGKR34T");
    await page.click("#btn-login");

    page.waitForTimeout(5000);

    return browser.wsEndpoint();
}

async function getAll() {
    var databases = [];
    var browserwsEndPoint = await startPuppeter(true);
    const browser = await puppeteer.connect({
        browserWSEndpoint: browserwsEndPoint,

    });

    //Read Files
    fs.readdir(path.join(__dirname, "data"),(err, files) => {
        if(err) {
            console.log(err.message);
            return;
        }

        files.map((value) => {
            databases.push(require('./data/'+value));
        });

        var countFix = 0;

        databases.map(async (data, index) => {
            await data.main(browser).then((data) => {
                console.log(`Fetched`)
                countFix+=data;
            });

            if(countFix === 7) {
                browser.close();
                return 0;
            }
        });
    });
}

async function getDetailDesaLengkap() {
    var browserwsEndPoint = await startPuppeter(true);
    const browser = await puppeteer.connect({
        browserWSEndpoint: browserwsEndPoint,
    });

    const data = require("./data/DetailDesaLengkap");
    await data.main(browser).then(() => {
        console.log("Fetched");
        browser.close();
    });
}

async function getRekapTahapan() {
    var browserwsEndPoint = await startPuppeter(true);
    const browser = await puppeteer.connect({
        browserWSEndpoint: browserwsEndPoint,

    });

    const data = require("./data/RekapTahapan");
    await data.main(browser).then(() => {
        console.log("Fetched");
        browser.close();
    });
}

module.exports = {
    getAll,
    startPuppeter,
    getDetailDesaLengkap,
    getRekapTahapan
}