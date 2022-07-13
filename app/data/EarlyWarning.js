require('dotenv').config();
const puppeteer = require('puppeteer');
const writer = require('./../Writer');


const data = [];

async function main(browser, headless = true) {
    const page = await browser.newPage();

    await page.goto("https://ptsl.atrbpn.go.id/EarlyWarning/PengumumanNasional");
    await page.waitForNetworkIdle();
    let pos_ntb = await page.$$eval('#right_col > div > div.row > div > div > div.x_content > div > table > tbody > tr', el => el.findIndex(val => val.children[1].textContent === "NTB"));
    pos_ntb++;

    await page.click(`#right_col > div > div.row > div > div > div.x_content > div > table > tbody > tr:nth-child(${pos_ntb}) > td:nth-child(2)`);
    await page.waitForNetworkIdle();

    let list_kantah = await page.$$("#right_col > div > div.row > div > div > div.x_content > div > table > tbody > tr");

    for(var iKantah = 1; iKantah < list_kantah.length; iKantah++) {
        var kantah = {
            no: await page.$eval(`#right_col > div > div.row > div > div > div.x_content > div > table > tbody > tr:nth-child(${iKantah}) > td:nth-child(1)`, el => el.textContent.trim()),
            kantah: await page.$eval(`#right_col > div > div.row > div > div > div.x_content > div > table > tbody > tr:nth-child(${iKantah}) > td:nth-child(2)`, el => el.textContent.trim()),
            jumlah: await page.$eval(`#right_col > div > div.row > div > div > div.x_content > div > table > tbody > tr:nth-child(${iKantah}) > td:nth-child(3)`, el => el.textContent.trim().replace('.', ''))
        }

        data.push(kantah);
    }

    writer.toJson(data, "early_warning");

    await page.close();

    return 1;
}

module.exports.main = main;