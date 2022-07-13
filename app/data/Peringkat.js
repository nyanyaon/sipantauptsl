const puppeteer = require('puppeteer');
const writer = require('./../Writer');

const data = [];

async function main(browser, headless = false) {
    const page = await browser.newPage();

    await page.goto("https://ptsl.atrbpn.go.id/Kinerja");
    await page.waitForSelector("#flip-scroll > table > tbody > tr", {timeout: 100000})
    var list_prov = await page.$$("#flip-scroll > table > tbody > tr");
    for(var iProv = 1; iProv < list_prov.length; iProv++) {
        var prov = {
            no: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iProv}) > td:nth-child(1)`, el => el.textContent.trim()),
            nama: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iProv}) > td:nth-child(2)`, el => el.textContent.trim()),
            nilai_perencanaan: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iProv}) > td:nth-child(3)`, el => el.textContent.trim()),
            nilai_kuantitas: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iProv}) > td:nth-child(4)`, el => el.textContent.trim()),
            nilai_kualitas: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iProv}) > td:nth-child(5)`, el => el.textContent.trim()),
            nilai_kinerja: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iProv}) > td:nth-child(6)`, el => el.textContent.trim())
        }

        data.push(prov);
    }

    writer.toJson(data, 'peringkat');

    await page.close();

    return 1;
}

module.exports.main = main;