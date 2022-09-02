const getter = require('./app/Getter');
const waBot = require('./app/bot/WA');
const render = require('./app/Render');
const memorizer = require('./app/Memorizer');
const cron = require('node-cron');
const ndllocker = require('./app/NDLLocker');
const logger = require('./app/Logger');
const report = require('./app/Report');
const fs = require('fs');
const path = require('path');
const db = require('./app/database/Database');
const listdata = require("./app/database/ListData");
const { MessageMedia } = require('whatsapp-web.js');

console.log("SPAN PTSL Running...");
console.log("Wait for cron")

waBot.client.initialize();

process.on('exit', (code) => {
    waBot.client.sendMessage('6287755052654@c.us', 'The bot has stopped with error code ' + code);
});

cron.schedule('30 7 * * *', async () => {
    await getter.getAll();
    logger.info("Data Get at " + new Date().toString());
});

cron.schedule('35 7 * * *', async () => {
    memorizer.init();
    logger.info("Data saved to database at " + new Date().toString());
});

cron.schedule('35 7 * * *', async () => {
    await render.renderEarlyWarning();
    await render.renderKinerja();
    await render.renderKinerjaKantah();
    await render.renderKuantitas();
    logger.info("render data at " + new Date().toString());
    await ndllocker.getDesaNDL();
    logger.info("Lapor desa ndl data at " + new Date().toString());
});

//data desa ndl for lock list desa
cron.schedule('10 22 * * *', async () => {
    await getter.getDetailDesaLengkap();
    logger.info("Data Get at " + new Date().toString());
});

cron.schedule('13 22 * * *', async () => {
    memorizer.saveDetailDesa();
    logger.info("Data Save at " + new Date().toString());
});

cron.schedule('30 22 * * *', async () => {
    await ndllocker.getDesaNDL();
    logger.info("Check Desa NDL at " + new Date().toString());
});

waBot.client.on("message", async (msg) => {
    if (msg.body === '!pantau' && waBot.LIST_CONTACT.find(val => val === msg.from)) {
        waBot.client.sendMessage(msg.from, 'Tunggu sebentar ya 🙏, kami sedang mengambil data terbaru')

        await getter.getDetailDesaLengkap();
        ndllocker.getDesaNDLJSON(msg.from);
    }

    if (msg.body === '!report' && waBot.LIST_CONTACT.find(val => val === msg.from)) {
        await render.renderEarlyWarning();
        await render.renderKinerja();
        await render.renderKinerjaKantah();
        await render.renderKuantitas();
        await report.sendReport(msg.from);
    }

    if (msg.body.toLowerCase() === "!detaildesa") {
        render.KANTAH.forEach(val => {
            render.renderDesaNDL(val);
        });
        let photos = fs.readdirSync(path.join(__dirname, 'image/potensidesalengkap'), { withFileTypes: true });
        photos.forEach(file => {
            waBot.client.sendMessage(msg.from, MessageMedia.fromFilePath(path.join(__dirname, 'image/potensidesalengkap/' + file.name)));
        });
    }

    if (msg.body === '!update') {
        waBot.client.sendMessage(msg.from, 'Tunggu sebentar ya 🙏, kami sedang mengambil data terbaru')
        await getter.getAll();
        waBot.client.sendMessage(msg.from, 'Sudah')
    }

    if (msg.body === '!sendtoall') {
        await render.renderEarlyWarning();
        await render.renderKinerja();
        await render.renderKinerjaKantah();
        await render.renderKuantitas();
        waBot.LIST_CONTACT.forEach(async contact => {
            await report.sendReport(contact);
        })
    }

    if (msg.body === '!test') {
        await report.sendReport("6285640121314@c.us");
    }
});

