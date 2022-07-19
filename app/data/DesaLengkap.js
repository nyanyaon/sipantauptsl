require('dotenv').config();
const puppeteer = require('puppeteer');
const writer = require('./../Writer');

const data = [];

async function main(browser, headless = false) {
    const page = await browser.newPage();

    await page.goto("https://ptsl.atrbpn.go.id/BidangTanah");
    await page.waitForNetworkIdle();

    await page.click("#htplaceholder > tr:nth-child(23) > td:nth-child(2)");
    await page.waitForNetworkIdle();

    let list_kantah = await page.$$("#htplaceholder > tr");

    for(var iKantah = 1; iKantah < list_kantah.length; iKantah++) {
        var kantah = {
            no: await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(1)`, el => el.textContent.trim()),
            kantah: await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(2)`, el => el.textContent.trim()),
            jumlah: await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(20)`, el => el.textContent.trim())
        }

        data.push(kantah);
    }

    writer.toJson(data, "desalengkap");

    await page.close();

    return 1;
}

module.exports.main = main;
