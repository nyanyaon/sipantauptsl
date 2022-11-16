const fs = require("fs");
const path = require("path");
const wa = require('./bot/WA');
const puppeteer = require("puppeteer");
const cluster = require("puppeteer-cluster");
const DesaLengkap = require('./model/DesaLengkap');
const Database = require('./db/Database');
const RekapKuantitas = require("./model/RekapKuantitas");

class Getter {
    static HOST = '6285640121314@c.us';
    static browser;

    async startPuppeter(headless = false) {
        Getter.browser = await puppeteer.launch({
            userDataDir: './datadir',
            args: ["--no-sandbox"],
            headless,
        });
    }

    async login(user, headless = false) {
        if(fs.existsSync('./cookies.json')) {
            wa.client.sendMessage(user, "seseorang sudah login");
            return;
        }

        await this.startPuppeter();
        const page = await Getter.browser.newPage();

        page.on('response', async (response) => {
            const url = response.url();

            if (url.includes("token")) {
                console.log(`URL: ${url}`);
                console.log(`JSON: ${JSON.stringify(await response.json())}`);

                if (response.status() !== 200) {
                    wa.client.sendMessage(user, 'Username dan Password Salah');
                    await Getter.browser.close();
                    return;
                }

                wa.client.sendMessage(user, 'Harap masukan otp');
            }
        });


        await page.goto('https://ptsl-statistik.atrbpn.go.id/', {
            waitUntil: 'networkidle2',
        });

        await this.usernameHandler(user, page);
    }

    async usernameHandler(user, page) {
        await wa.client.sendMessage(user, "Silahkan ketik username");

        wa.client.once('message', async (msg) => {
            if (msg.from === user) {
                await page.type('#username', msg.body);
                await wa.client.sendMessage(user, "Silahkan ketik password");
                await this.passwordHandler(user, page);
                return;
            }

            this.usernameHandler(user, page); //if multiple user send something
        });
    }

    async passwordHandler(user, page) {
        wa.client.once('message', async (msg) => {
            if (msg.from === user) {
                await page.type('#inputPassword', msg.body);
                await page.click('#kc-next');
                await this.tokenHandler(user, page);
                return;
            }

            this.passwordHandler(user, page);
        });
    }

    async tokenHandler(user, page) {
        wa.client.once('message', async (msg) => {
            await page.type('#otp-field>input', msg.body);
            await page.click('#kc-login');

            await page.waitForNavigation({
                waitUntil: 'networkidle2',
                timeout: 9999999
            });

            await page.goto('https://aplikasi.atrbpn.go.id/pintasan', {
                waitUntil: 'networkidle2',
            });

            await page.waitForNetworkIdle();

            const name = await page.$eval('p > b', el => el.textContent);

            wa.client.sendMessage(user, name);

            const client = await page.target().createCDPSession();
            const cookies = (await client.send('Network.getAllCookies')).cookies;
            fs.writeFileSync('./cookies.json', JSON.stringify(cookies, null, 2));

            await page.waitForNetworkIdle();

            wa.client.sendMessage(user, "sesi anda akan berakhir dalam 8 jam");
            await Getter.browser.close();
        });
    }

    // async getAll() {
    //     var databases = [];
    //     await this.startPuppeter(false);
    //     const browser = await puppeteer.connect({
    //         browserWSEndpoint: browserwsEndPoint,
    //     });

    //     //Read Files
    //     fs.readdir(path.join(__dirname, "data"), (err, files) => {
    //         if (err) {
    //             console.log(err.message);
    //             return;
    //         }

    //         files.map((value) => {
    //             databases.push(require('./data/' + value));
    //         });

    //         var countFix = 0;

    //         databases.map(async (data, index) => {
    //             await data.main(browser).then((code) => {
    //                 if (code == 1) {
    //                     console.log(`Fetched`)
    //                     countFix += code;
    //                 }
    //             });

    //             if (countFix === 7) {
    //                 await browser.close();
    //                 return 0;
    //             }
    //         });
    //     });
    // }

    async getDetailDesaLengkap(user) {
        await this.startPuppeter();


        const db = new Database();
        await db.connect();
        const coll = db.getCollection('desalengkap');

        try {
            const page = await Getter.browser.newPage();

            const cookiesStr = fs.readFileSync('./cookies.json');
            const cookies = JSON.parse(cookiesStr);
            await page.setCookie(...cookies);

            await page.goto("https://ptsl-statistik.atrbpn.go.id/BidangTanah/", {
                waitUntil: 'networkidle2',
            });

            await page.waitForNetworkIdle();

            await page.waitForSelector("#htplaceholder > tr:nth-child(23) > td:nth-child(2)", { timeout: 100000 });
            await page.click("#htplaceholder > tr:nth-child(23) > td:nth-child(2)");
            await page.waitForNetworkIdle();

            let list_kantah = await page.$$("#htplaceholder > tr");
            let nomer = 1;

            for (var iKantah = 1; iKantah < list_kantah.length; iKantah++) {
                await page.waitForSelector(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(2)`, { timeout: 50000 });
                await page.waitForNetworkIdle();
                let nama_kantah = await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(2)`, el => el.textContent);
                await page.click(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(2)`);
                await page.waitForNetworkIdle({ timeout: 100000 });
                let list_desa = await page.$$("#flip-scroll > table > tbody > tr");

                for (var iDesa = 1; iDesa <= list_desa.length; iDesa++) {
                    await page.waitForSelector("#flip-scroll > table > tbody > tr")
                    const desa = new DesaLengkap(
                        nomer++,
                        nama_kantah,
                        await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(3)`, el => el.textContent),
                        await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(4)`, el => el.textContent.replaceAll(".", "")),
                        await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(5)`, el => el.textContent.replaceAll(".", "")),
                        await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(6)`, el => el.textContent.replaceAll(".", "")),
                        await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(7)`, el => el.textContent.replaceAll(".", "")),
                        await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(8)`, el => el.textContent.replaceAll(".", "")),
                        await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(9)`, el => el.textContent.replaceAll(".", "")),
                        await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(10)`, el => el.textContent.replaceAll(".", "")),
                        await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(11)`, el => el.textContent.replaceAll(".", "")),
                        await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(12)`, el => el.textContent.replaceAll(".", "")),
                        await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(13)`, el => el.textContent.replaceAll(".", "")),
                        await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(14)`, el => el.textContent.replaceAll(".", "")),
                        await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(15)`, el => el.textContent.replaceAll(".", "")),
                        await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(16)`, el => el.textContent.replace(",", ".")),
                        await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(17)`, el => el.textContent.replace(",", ".")),
                        await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(18)`, el => el.textContent.replace(",", ".")),
                        await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(19)`, el => el.textContent.replace(",", ".")),
                        await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(20)`, el => el.textContent.replace(",", ".")),
                        await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(21)`, el => el.textContent.replaceAll(".", "")),
                        await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(22)`, el => el.textContent.replaceAll(".", "")),
                        await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(23)`, el => el.textContent.replaceAll(".", "")),
                        await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(24)`, el => el.textContent.replace(",", ".")),
                        await page.$eval(`#flip-scroll > table > tbody > tr:nth-child(${iDesa}) > td:nth-child(25)`, el => el.textContent),
                    )

                    coll.insertOne(desa);
                }

                await page.goBack();
            }

            await Getter.browser.close();
            await wa.client.sendMessage(user, "Query Sukses");

        } catch (err) {
            console.log(err);
        }
    }

    async getRekapTahapan(user) {
        await this.startPuppeter();


        const db = new Database();
        await db.connect();
        const coll = db.getCollection('rekapkuantitas');

        try {
            const page = await Getter.browser.newPage();

            const cookiesStr = fs.readFileSync('./cookies.json');
            const cookies = JSON.parse(cookiesStr);
            await page.setCookie(...cookies);

            await page.goto("https://ptsl-statistik.atrbpn.go.id/Progress");
            await page.waitForNetworkIdle();
            await page.click("#htplaceholder > tr:nth-child(23) > td.tbltitle");
            await page.waitForNetworkIdle();

            let list_kantah = await page.$$("#htplaceholder > tr");
            for (var iKantah = 1; iKantah <= list_kantah.length - 1; iKantah++) {
                const rekap = new RekapKuantitas(
                    await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(1)`, el => el.textContent),
                    await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(2)`, el => el.textContent),
                    await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(3)`, el => el.textContent.replaceAll(".", "")),
                    await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(4)`, el => el.textContent.replaceAll(".", "")),
                    await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(5)`, el => el.textContent.replaceAll(".", "")),
                    await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(6)`, el => el.textContent.replaceAll(".", "")),
                    await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(7)`, el => el.textContent.replaceAll(".", "")),
                    await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(8)`, el => el.textContent.replaceAll(".", "")),
                    await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(9)`, el => el.textContent.replaceAll(".", "")),
                    await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(10)`, el => el.textContent.replaceAll(".", "")),
                    await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(11)`, el => el.textContent.replaceAll(".", "")),
                    await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(12)`, el => el.textContent.replaceAll(".", "")),
                    await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(13)`, el => el.textContent.replaceAll(".", "")),
                    await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(14)`, el => el.textContent.replaceAll(".", "")),
                    await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(15)`, el => el.textContent.replaceAll(".", "")),
                    await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(16)`, el => el.textContent.replaceAll(".", "")),
                    await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(17)`, el => el.textContent.replaceAll(".", "")),
                    await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(18)`, el => el.textContent.replaceAll(".", "")),
                    await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(19)`, el => el.textContent.replaceAll(".", "")),
                    await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(20)`, el => el.textContent.replaceAll(".", "")),
                    await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(21)`, el => el.textContent.replaceAll(".", "")),
                    await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(22)`, el => el.textContent.replaceAll(".", "")),
                    await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(23)`, el => el.textContent.trim().replaceAll("\n", "").replace(",", ".")),
                    await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(24)`, el => el.textContent.trim().replaceAll("\n", "").replace(",", ".")),
                    await page.$eval(`#htplaceholder > tr:nth-child(${iKantah}) > td:nth-child(25)`, el => el.textContent.trim().replaceAll("\n", "").replace(",", ".")),
                )

                coll.insertOne(rekap);
            }

            await Getter.browser.close();
            await wa.client.sendMessage(user, "Query Sukses");

        } catch (err) {
            console.log(err);
        }
    }
}

module.exports.Getter = Getter;