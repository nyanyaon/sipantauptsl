require('dotenv').config();
const puppeteer = require('puppeteer');
const writer = require('./../Writer');

const data = [];

async function main(browser, headless = false) {
    const page = await browser.newPage();

    await page.goto("https://ptsl.atrbpn.go.id/BidangTanah");
    await page.waitForSelector("#htplaceholder > tr:nth-child(23) > td:nth-child(2)", {timeout: 100000});
    await page.click("#htplaceholder > tr:nth-child(23) > td:nth-child(2)");
    await page.waitForNetworkIdle();

    let list_kantah = await page.$$("#htplaceholder > tr");
    let nomer = 1;

    for(var iKantah = 1; iKantah < list_kantah.length; iKantah++) {
        let nama_kantah = await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(2)`, el => el.textContent);
        await page.click(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(2)`);
        await page.waitForNetworkIdle({timeout: 100000});
        let list_desa = await page.$$("#flip-scroll > table > tbody > tr");
        
        for(var iDesa = 1; iDesa <= list_desa.length; iDesa++) {
            await page.waitForSelector("#flip-scroll > table > tbody > tr")
            let desa = {
                no: nomer++,
                kantah: nama_kantah,
                desa: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(3)`, el => el.textContent),
                luas: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(4)`, el => el.textContent.replaceAll(".", "")),
                btValidAwal: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(5)`, el => el.textContent.replaceAll(".", "")),
                btAwal: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(6)`, el => el.textContent.replaceAll(".", "")),
                btValid: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(7)`, el => el.textContent.replaceAll(".", "")),
                jumlahBt: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(8)`, el => el.textContent.replaceAll(".", "")),
                luasPersilValidAwal: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(9)`, el => el.textContent.replaceAll(".", "")),
                luasPersilValid: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(10)`, el => el.textContent.replaceAll(".", "")),
                luasPersil: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(11)`, el => el.textContent.replaceAll(".", "")),
                scanWarkahBTAwal: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(12)`, el => el.textContent.replaceAll(".", "")),
                scanWarkahBT: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(13)`, el => el.textContent.replaceAll(".", "")),
                warkahPTSL: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(14)`, el => el.textContent.replaceAll(".", "")),
                targetSHAT: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(15)`, el => el.textContent.replaceAll(".", "")),
                persenValidasiBT: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(16)`, el => el.textContent.replace(",", ".")),
                persenValidasiPersilLuas: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(17)`, el => el.textContent.replace(",", ".")),
                persenValidasiPersilBidang: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(18)`, el => el.textContent.replace(",", ".")),
                persenScanWarkah: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(19)`, el => el.textContent.replace(",", ".")),
                NDL: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(20)`, el => el.textContent.replace(",", ".")),
                jumlahKW456: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(21)`, el => el.textContent.replaceAll(".", "")),
                luasKW456: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(22)`, el => el.textContent.replaceAll(".", "")),
                jumlahPersilDeliniasi: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(23)`, el => el.textContent.replaceAll(".", "")),
                persenPersilDeliniasi: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(24)`, el => el.textContent.replace(",", ".")),
                deklarasi: await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(25)`, el => el.textContent),
            }

            data.push(desa);
        }

        await page.goBack();
    }

    writer.toJson(data, "detail_desalengkap");

    await page.close();

    return 1;
}

module.exports.main = main;
