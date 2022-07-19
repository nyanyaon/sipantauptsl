const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const { Client, LocalAuth, Buttons, MessageMedia, NoAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});

let list_contact = [
  '6282144027829@c.us',
  '6285739226216@c.us',
  '6281909001900@c.us',
  // '6282144485767@c.us',
  // '6281236137288@c.us',
];

const date = new Date();
let tanggal = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
  const peringkat = require('../../data/peringkat.json');
  const dataEarlyWarning = require('../../data/earlywarning.json');
  const desaLengkap = require('../../data/desalengkap.json');
  var jumlahDesa = 0;
  desaLengkap.map(desa => { jumlahDesa += new Number(desa.jumlah) })

  console.log('Client is ready!');
  cron.schedule('10 8 * * *', async () => {
    console.log('running a task every 5 minute');
    for(number of list_contact) {
      client.sendMessage(number, 
        "*SPAN (SISTEM PELAPORAN) PTSL NTB*\n"+
        "Tanggal : " + tanggal + "\n" +
        "Berikut disampaikan Peringkat Nasional Kinerja PTSL wilayah NTB Tahun 2022: "
        );
        
      await client.sendMessage(number, MessageMedia.fromFilePath(path.join(__dirname, '../../image/rekapkinerja.png')));
      await client.sendMessage(number, `Mohon ditingakatkan kembali kinerjanya bapak-bapak/ibu-ibu *peringkat NTB* saat ini *${peringkat.find((val) => val.nama === "NTB").no}*`);
      // await client.sendMessage(number, MessageMedia.fromFilePath(path.join(__dirname,"../../image/rekapkinerja_kantah.png")));
      await client.sendMessage(number, MessageMedia.fromFilePath(path.join(__dirname,"../../image/rekap_kuantitas.png")));
      await client.sendMessage(number, "Mohon *Ditingkatkan* untuk yang *persentase* capaiannya *masih rendah*");
      await client.sendMessage(number, "*Early Warning NTB*\nTerkait pengumuman kadaluarsa untuk segera ditindaklanjuti");
      await client.sendMessage(number, MessageMedia.fromFilePath(path.join(__dirname,"../../image/early_warning.png")));
      await client.sendMessage(number, "#NTB_KINI_LEBIH_BAIK");

      console.log('Terkirim ke :' + number);
    }
  });

  for(number of list_contact) {
    var message = desaLengkap.map(desa => {
      return `${desa.kantah} = ${desa.jumlah}\n` 
    }).toString().replaceAll(",", "");
    client.sendMessage(number, `*MONITORING DESA LENGKAP*\Jumlah Desa NDL ${jumlahDesa}\n${message}\nUntuk *info lebih* balas *'detaildesa'* tanpa tanda petik`);
    console.log('Terkirim ke :' + number);
  }
});


client.on("message", async (msg) => {
    console.log(await msg.getContact());
    if(msg.body === '!info') {
      msg.reply(`
      *SIPANTAU*
      Sistem Pemantauan PTSL v1
      `);
    }
    if(msg.body === '!bersihkan') {
      msg.delete(false);
    }

    if(msg.body.toLowerCase() === "detaildesa") {
      var photos = fs.readdirSync(path.join(__dirname, '../../image/potensidesalengkap'), {withFileTypes: true});
      console.log(photos)
      photos.forEach(file => {
        if(file.isDirectory()) {
          return;
        }
  
        client.sendMessage(msg.from, MessageMedia.fromFilePath(path.join(__dirname, '../../image/potensidesalengkap/'+file.name)));
      });
    }
});

module.exports = {
  client
}

