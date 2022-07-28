const getter = require('./app/Getter');
const waBot = require('./app/bot/WA');
const render = require('./app/Render');
const memorizer = require('./app/Memorizer')
const cron = require('node-cron')
const ndllocker = require('./app/NDLLocker');
const cekinternet = require('./cekinternet');
const logger = require('./app/Logger')
const db = require('./app/database/Database');
const listdata = require("./app/database/ListData");

console.log("SPAN PTSL Running...");
console.log("Wait for cron")

waBot.client.initialize();

cron.schedule('10 5 * * *', async () => { 
    getter.getAll();
    logger.info("Data Get at " + new Date().toString()); 
});

cron.schedule('30 5 * * *', async () => { 
    memorizer.init();
    logger.info("Data saved to database at " + new Date().toString()); 
});

cron.schedule('10 7 * * *', async () => { 
    render.KANTAH.forEach(val => {
        render.renderDesaNDL(val);
    });
    
    render.renderEarlyWarning();
    render.renderKinerja();
    render.renderKinerjaKantah();
    render.renderKuantitas();
    logger.info("render data at " + new Date().toString()); 
    ndllocker.getDesaNDL();
    logger.info("Lapor desa ndl data at " + new Date().toString()); 
});

//data desa ndl for lock list desa
cron.schedule('10 22 * * *', async () => { 
    getter.getDetailDesaLengkap();
    logger.info("Data Get at " + new Date().toString()); 
});

cron.schedule('13 22 * * *', async () => { 
    memorizer.saveDetailDesa();
    logger.info("Data Save at " + new Date().toString());
});

cron.schedule('30 22 * * *', async () => { 
    ndllocker.getDesaNDL();
    logger.info("Check Desa NDL at " + new Date().toString());
});

cron.schedule('0 */4 * * *', async () => { 
    logger.info("Check Internet at " + new Date().toString());
    await cekinternet();
});


waBot.client.on("message", async (msg) => {
    if(msg.body === '!pantau' && waBot.LIST_CONTACT.find(val => val === msg.from)) {
        await getter.getDetailDesaLengkap();
        ndllocker.getDesaNDLJSON();
    }
});
