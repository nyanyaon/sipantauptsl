const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const db = require('../database/Database');
const { Client, LocalAuth, Buttons, MessageMedia, NoAuth } = require('whatsapp-web.js');

const client = new Client({
  authStrategy: new LocalAuth()
});

const LIST_CONTACT = [
  '6282144027829@c.us', //pak rahmat
  '6287755052654@c.us', //Kholil
  '6285739226216@c.us', //Bang Pandu
  '6287865736939@c.us', //Bu Yayu
  '6281320374405@c.us', //Pak ade
  '6281909001900@c.us', //Bu indah
  '6282144485767@c.us', //Pak Kabid
  '6285640121314@c.us', //Pak Ajudan Korsub HHP
  // '6281236137288@c.us', // kakanwil
];

const GROUP_SPNTB = "6281328030654-1424945309@g.us";

const date = new Date();
let tanggal = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
  console.log('Client is ready!');
  // cron.schedule('25 9 * * 1,5', async () => {
  //   const peringkat = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/peringkat.json')));
  //   const desaLengkap = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/desalengkap.json')));
  //   var jumlahDesa = 0;
  //   desaLengkap.map(desa => { jumlahDesa += new Number(desa.jumlah) })

  //   for (number of LIST_CONTACT) {
  //     client.sendMessage(number,
  //       "*SPAN (SISTEM PELAPORAN) PTSL NTB*\n" +
  //       "Tanggal : " + tanggal + "\n" +
  //       "Berikut disampaikan Peringkat Nasional Kinerja PTSL wilayah NTB Tahun 2022: "
  //     );

  //     await client.sendMessage(number, MessageMedia.fromFilePath(path.join(__dirname, '../../image/rekapkinerja.png')));
  //     await client.sendMessage(number, `Mohon ditingakatkan kembali kinerjanya bapak-bapak/ibu-ibu *peringkat NTB* saat ini *${peringkat.find((val) => val.nama === "NTB").no}*`);
  //     // await client.sendMessage(number, MessageMedia.fromFilePath(path.join(__dirname,"../../image/rekapkinerja_kantah.png")));
  //     await client.sendMessage(number, MessageMedia.fromFilePath(path.join(__dirname, "../../image/rekap_kuantitas.png")));
  //     await client.sendMessage(number, "Mohon *Ditingkatkan* untuk yang *persentase* capaiannya *masih rendah*");
  //     await client.sendMessage(number, "*Early Warning NTB*\nTerkait pengumuman kadaluarsa untuk segera ditindaklanjuti");
  //     await client.sendMessage(number, MessageMedia.fromFilePath(path.join(__dirname, "../../image/early_warning.png")));
  //     var message = desaLengkap.map(desa => {
  //       return `${desa.kantah} = ${desa.jumlah}\n`
  //     }).toString().replaceAll(",", "");
  //     client.sendMessage(number, `*MONITORING DESA LENGKAP* \nJumlah Desa NDL ${jumlahDesa}\n${message}\nUntuk *info lebih* balas *'detaildesa'* tanpa tanda petik`);
  //     await client.sendMessage(number, "#NTB_KINI_LEBIH_BAIK");

  //     console.log('Terkirim ke :' + number);
  //   }
  // });
});


client.on("message", async (msg) => {
  const conn = db.conn;
  const USERS = [];

  
  client.sendMessage(msg.from, "*ERROR 503* Maaf kami sedang mengalami gangguan 🙏😥")

  let getUser = new Promise(function (resolve, reject) {
    conn.serialize(function () {
      conn.each("SELECT * FROM users", function (err, row) {
        USERS.push(row); //pushing rows into array
      }, function () {
        resolve(true); // calling function when all rows have been pulled
      });//closing connection
    });
  });

  await getUser;

  if (USERS.find(val => val.nomer == msg.from) === undefined) {
    client.sendMessage(msg.from, `Halo ${(await msg.getContact()).pushname},\nSelamat Datang di 🎁 *SIPANTAU* (Sistem Pemantauan PTSL v1)\n*'!info'* Tentang bot\n*!pantau* Laporkan desa ndl yang perlu dimaintanance\n*!detaildesa* Analisis desa NDL\n*!report* Laporan lengkap PTSL\n\n©2022 with ❤️\nby Kantor Wilayah Badan Pertanahan Nasional Nusa Tenggara Barat\n*#NTBKINILEBIHBAIK*`);
    db.insertUsers(msg.from, (await msg.getContact()).pushname);
  }

  if (msg.body === '!info') {
    msg.reply(`🎁 *SIPANTAU* (Sistem Pemantauan PTSL v1)\n*'!info'* tentang bot\n*!pantau* laporkan desa ndl yang perlu dimaintanance\n*!detaildesa* analisis desa NDL\n*!report* laporan lengkap PTSL\n\n©2022 with ❤️\nby Kantor Wilayah Badan Pertanahan Nasional Nusa Tenggara Barat\n*#NTBKINILEBIHBAIK*`);
  }
});

module.exports = {
  client,
  LIST_CONTACT,
  GROUP_SPNTB
}

