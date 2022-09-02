require('dotenv').config();
const puppeteer = require('puppeteer');
const writer = require('./../Writer');

async function main(browser, headless = false) {
    const data = [];
    const page = await browser.newPage();

    await page.goto("https://ptsl.atrbpn.go.id/Progress");
    await page.waitForSelector("#flip-scroll > table > tbody > tr", {timeout: 50000});
    await page.click("#htplaceholder > tr:nth-child(23) > td.tbltitle");
    await page.waitForNetworkIdle();

    let list_kantah = await page.$$("#htplaceholder > tr");
    for(var iKantah = 1; iKantah <= list_kantah.length; iKantah++) {
        var kantah = {
            no: await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(1)`, el => el.textContent),
            kantah: await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(2)`, el => el.textContent),
            targetpbt: await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(3)`, el => el.textContent.replaceAll(".", "")),
            targetshat: await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(4)`, el => el.textContent.replaceAll(".", "")),
            targetk4: await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(5)`, el => el.textContent.replaceAll(".", "")),
            survei: await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(6)`, el => el.textContent.replaceAll(".", "")),
            pemetaan: await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(7)`, el => el.textContent.replaceAll(".", "")),
            puldadis: await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(8)`, el => el.textContent.replaceAll(".", "")),
            pemberkasan: await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(9)`, el => el.textContent.replaceAll(".", "")),
            potensiK1: await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(10)`, el => el.textContent.replaceAll(".", "")),
            K1: await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(11)`, el => el.textContent.replaceAll(".", "")),
            capaianpbt: await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(23)`, el => el.textContent.trim().replaceAll("\n", "").replace(",", ".")),
            capaianshat: await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(24)`, el => el.textContent.trim().replaceAll("\n", "").replace(",", ".")),
            capaiank4: await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(25)`, el => el.textContent.trim().replaceAll("\n", "").replace(",", ".")),
        }

        data.push(kantah);
    }
    await page.close();
    writer.toJson(data, 'rekapkuantitas');

    return 1;
}

module.exports.main = main;