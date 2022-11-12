const { Getter } = require('./app/Getter');
const waBot = require('./app/bot/WA');
const render = require('./app/Render');
const Database = require('./app/db/Database');
const mongoDB = require('mongodb');
const { MessageMedia } = require('whatsapp-web.js');
const User = require('./app/model/User');

console.log("SIPANTAU PTSL Running...");
waBot.client.initialize();

// cron.schedule('30 7 * * *', async () => {
//     await getter.getAll();
//     logger.info("Data Get at " + new Date().toString());
// });

// cron.schedule('35 7 * * *', async () => {
//     memorizer.init();
//     logger.info("Data saved to database at " + new Date().toString());
// });

// cron.schedule('35 7 * * *', async () => {
//     await render.renderEarlyWarning();
//     await render.renderKinerja();
//     await render.renderKinerjaKantah();
//     await render.renderKuantitas();
//     logger.info("render data at " + new Date().toString());
//     await ndllocker.getDesaNDL();
//     logger.info("Lapor desa ndl data at " + new Date().toString());
// });

// //data desa ndl for lock list desa
// cron.schedule('10 22 * * *', async () => {
//     await getter.getDetailDesaLengkap();
//     logger.info("Data Get at " + new Date().toString());
// });

// cron.schedule('13 22 * * *', async () => {
//     memorizer.saveDetailDesa();
//     logger.info("Data Save at " + new Date().toString());
// });

// cron.schedule('30 22 * * *', async () => {
//     await ndllocker.getDesaNDL();
//     logger.info("Check Desa NDL at " + new Date().toString());
// });

function insertUser(user, coll) {
    waBot.client.prependOnceListener('message', async (msg) => {
        if (user === msg.from) {
            coll.insertOne(new User(
                user,
                msg.body,
                "",
                new Date(),
                "",
                false,
            ));
            
            let data = coll.find({userId: user});
            let dataDetail = await data.toArray();

            waBot.client.sendMessage(user, `Halo ${dataDetail[0].nama}, Selamat datang di *SIPANTAU PTSL*, harap ketik *!info* untuk info lebih lanjut`);
        } else {
            insertUser(user, coll);
        }
    });

    
}

waBot.client.on("message", async (msg) => {
    waBot.client.sendMessage(msg.from, "*UPDATE* Kami dalam tahap update");
    const db = new Database();
    await db.connect();
    const coll = db.getCollection('users');

    let user = coll.find({ userId: msg.from });
    let dataUser = await user.toArray();

    if (dataUser.length === 0) {
        waBot.client.sendMessage(msg.from, "Kami tidak mengetahui anda harap balas dengan nama");

        insertUser(msg.from, coll);
    }

    if (msg.body === '!info') {
        msg.reply('🎁 *SIPANTAU PTSL* (Sistem Pemantauan PTSL)\n*!info* Tentang SIPANTAU\n*!login* lakukan login pada aplikasi\n*!rekap* analisis yuridis\n\n©2022 with ❤️\nKantor Wilayah Badan Pertanahan Nasional Nusa Tenggara Barat\n*#NTBKINILEBIHBAIK*');
    }

    // if (msg.body === '!pantau' && waBot.LIST_CONTACT.find(val => val === msg.from)) {
    //     waBot.client.sendMessage(msg.from, 'Tunggu sebentar ya 🙏, kami sedang mengambil data terbaru')

    //     await getter.getDetailDesaLengkap();
    //     ndllocker.getDesaNDLJSON(msg.from);
    // }

    // if (msg.body === '!report' && waBot.LIST_CONTACT.find(val => val === msg.from)) {
    //     await render.renderEarlyWarning();
    //     await render.renderKinerja();
    //     await render.renderKinerjaKantah();
    //     await render.renderKuantitas();
    //     await report.sendReport(msg.from);
    // }

    if (msg.body === '!login' && waBot.LIST_CONTACT.find(val => val === msg.from)) {
        const getter = new Getter();
        getter.login(msg.from);
    }

    if (msg.body === '!rekap' && waBot.LIST_CONTACT.find(val => val === msg.from)) {
        const getter = new Getter();

        const coll = db.getCollection('rekapkuantitas');
        let data = coll.find({
            $where: function () {
                const now = new Date();
                return now.toLocaleDateString() === this.date.toLocaleDateString();
            }
        });

        let dataArr = await data.toArray();
        if (dataArr.length === 0) {
            await getter.getRekapTahapan(msg.from);

            data = coll.find({
                $where: function () {
                    const now = new Date();
                    return now.toLocaleDateString() === this.date.toLocaleDateString();
                }
            });

            dataArr = await data.toArray();
        }

        await render.renderRealisasiCapaianPTSL(dataArr);
        await render.renderPuldadis(dataArr);
        await render.renderPemberkasan(dataArr);
        await render.renderPotensiK1(dataArr);

        waBot.client.sendMessage(msg.from, "berikut kami sampaikan capaian puldadis per hari ini: ");
        waBot.client.sendMessage(msg.from, MessageMedia.fromFilePath('./image/realisasicapaianptsl.png'));
        waBot.client.sendMessage(msg.from, MessageMedia.fromFilePath('./image/rekap_puldadis.png'));
        waBot.client.sendMessage(msg.from, MessageMedia.fromFilePath('./image/rekap_pemberkasan.png'));
        waBot.client.sendMessage(msg.from, MessageMedia.fromFilePath('./image/rekap_potensi.png'));
    }

    // if (msg.body.toLowerCase() === "!detaildesa") {
    //     render.KANTAH.forEach(val => {
    //         render.renderDesaNDL(val);
    //     });
    //     let photos = fs.readdirSync(path.join(__dirname, 'image/potensidesalengkap'), { withFileTypes: true });
    //     photos.forEach(file => {
    //         waBot.client.sendMessage(msg.from, MessageMedia.fromFilePath(path.join(__dirname, 'image/potensidesalengkap/' + file.name)));
    //     });
    // }

    // if (msg.body === '!update') {
    //     waBot.client.sendMessage(msg.from, 'Tunggu sebentar ya 🙏, kami sedang mengambil data terbaru')
    //     await getter.getAll();
    //     waBot.client.sendMessage(msg.from, 'Sudah')
    // }

    // if (msg.body === '!sendtoall') {
    //     await render.renderEarlyWarning();
    //     await render.renderKinerja();
    //     await render.renderKinerjaKantah();
    //     await render.renderKuantitas();
    //     waBot.LIST_CONTACT.forEach(async contact => {
    //         await report.sendReport(contact);
    //     })
    // }

    // if (msg.body === '!test') {
    //     await report.sendReport("6285640121314@c.us");
    // }
});

