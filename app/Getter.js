const fs = require("fs");
const path = require("path");
const wa = require('./bot/WA');
const puppeteer = require("puppeteer");

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


        await page.goto('https://statistik.atrbpn.go.id/', {
            waitUntil: 'networkidle2',
        });

        await this.usernameHandler();
    }

    async usernameHandler() {
        await wa.client.sendMessage(user, "Silahkan ketik username");

        wa.client.once('message', async (msg) => {
            await page.type('#username', msg.body);
            await wa.client.sendMessage(user, "Silahkan ketik password");
            await this.passwordHandler();
        })
    }

    async passwordHandler() {
        wa.client.once('message', async (msg) => {
            await page.type('#inputPassword', msg.body);
            await this.tokenHandler();
        })
    }

    async tokenHandler() {
        await page.click('#kc-next');

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

            await Getter.browser.close();
        });
    }

    async getAll() {
        var databases = [];
        await this.startPuppeter(false);
        const browser = await puppeteer.connect({
            browserWSEndpoint: browserwsEndPoint,
        });

        //Read Files
        fs.readdir(path.join(__dirname, "data"), (err, files) => {
            if (err) {
                console.log(err.message);
                return;
            }

            files.map((value) => {
                databases.push(require('./data/' + value));
            });

            var countFix = 0;

            databases.map(async (data, index) => {
                await data.main(browser).then((code) => {
                    if (code == 1) {
                        console.log(`Fetched`)
                        countFix += code;
                    }
                });

                if (countFix === 7) {
                    await browser.close();
                    return 0;
                }
            });
        });
    }

    async getDetailDesaLengkap() {
        var browserwsEndPoint = await startPuppeter(false);
        const browser = await puppeteer.connect({
            browserWSEndpoint: browserwsEndPoint,
        });

        const data = require("./data/DetailDesaLengkap");
        await data.main(browser).then(() => {
            console.log("Fetched");
            browser.close();
        });
    }

    async getRekapTahapan() {
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
}

module.exports.Getter = Getter;