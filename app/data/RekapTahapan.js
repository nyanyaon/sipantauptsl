require('dotenv').config();
const puppeteer = require('puppeteer');
const writer = require('../Writer');


const data = [];

async function main(browser, headless = false) {
    const page = await browser.newPage();

    await page.goto("https://ptsl.atrbpn.go.id/Capaian/Tahapan");
    await page.waitForSelector("#flip-scroll > table > tbody > tr", {timeout: 50000});
    await page.click("#flip-scroll > table > tbody > tr:nth-child(23) > td:nth-child(2)");
    await page.waitForNetworkIdle();

    let list_kantah = await page.$$("#flip-scroll > table > tbody > tr");
    for(var iKantah = 1; iKantah <= list_kantah.length; iKantah++) {
        var kantah = {
            no: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iKantah}) > td:nth-child(1)`, el => el.textContent),
            kantah: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iKantah}) > td:nth-child(2)`, el => el.textContent),
            survei: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iKantah}) > td:nth-child(3)`, el => el.textContent.replaceAll(".", "")),
            pemetaan: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iKantah}) > td:nth-child(4)`, el => el.textContent.replaceAll(".", "")),
            puldadis: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iKantah}) > td:nth-child(5)`, el => el.textContent.replaceAll(".", "")),
            pemberkasan: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iKantah}) > td:nth-child(6)`, el => el.textContent.replaceAll(".", "")),
            pengumuman: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iKantah}) > td:nth-child(7)`, el => el.textContent.replaceAll(".", "")),
            pengesahan_sk: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iKantah}) > td:nth-child(8)`, el => el.textContent.replaceAll(".", "")),
            sertifikat: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iKantah}) > td:nth-child(9)`, el => el.textContent.replaceAll(".", "")),
            penyerahan: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iKantah}) > td:nth-child(10)`, el => el.textContent.replace(".", ""))
        };

        data.push(kantah);
    }

    writer.toJson(data, 'rekaptahapan');

    await page.close();

    return 1;
}

module.exports.main = main;