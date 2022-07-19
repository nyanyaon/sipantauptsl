const puppeteer = require('puppeteer');
const writer = require('./../Writer');

const data = [];

async function main(browser, headless = false) {
    const page = await browser.newPage();

    await page.goto("https://ptsl.atrbpn.go.id/Kinerja");
    await page.waitForSelector("#flip-scroll > table > tbody > tr");
    let pos = await page.$$eval("#flip-scroll > table > tbody > tr", el => el.findIndex(el => el.children[1].textContent === "NTB"));
    pos++;
    await page.click(`#flip-scroll > table > tbody > tr:nth-child(${pos}) > td.tbltitle`);
    await page.waitForNetworkIdle();
    var list_kantah = await page.$$("#flip-scroll > table > tbody > tr");

    for(var iKantah = 1; iKantah < list_kantah.length; iKantah++) {
        var kantah = {
            no: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iKantah}) > td:nth-child(1) > a`, el => el.textContent.trim()),
            nama: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iKantah}) > td:nth-child(2) > a`, el => el.textContent.trim()),
            nilai_perencanaan: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iKantah}) > td:nth-child(3) > a`, el => el.textContent.trim()),
            nilai_kuantitas: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iKantah}) > td:nth-child(4) > a`, el => el.textContent.trim()),
            nilai_kualitas: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iKantah}) > td:nth-child(5) > a`, el => el.textContent.trim()),
            nilai_kinerja: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iKantah}) > td:nth-child(6) > a`, el => el.textContent.trim())
        }

        data.push(kantah);
    }

    await page.close();

    writer.toJson(data, "kinerjakantah");

    return 1;
}

module.exports.main = main;