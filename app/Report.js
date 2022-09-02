const { MessageMedia } = require('whatsapp-web.js');
const { client } = require('./bot/WA');
const fs = require('fs');
const path = require('path');

async function sendReport(number) {
    const peringkat = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/peringkat.json')));
    const desaLengkap = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/desalengkap.json')));

    var jumlahDesa = 0;
    desaLengkap.map(desa => { jumlahDesa += new Number(desa.jumlah) })

    client.sendMessage(number,
        "*SPAN (SISTEM PELAPORAN) PTSL NTB*\n" +
        "Tanggal : " + new Date().toLocaleDateString() + "\n" +
        "Berikut disampaikan Peringkat Nasional Kinerja PTSL wilayah NTB Tahun 2022: "
    );

    await client.sendMessage(number, MessageMedia.fromFilePath(path.join(__dirname, '../image/rekapkinerja.png')));
    await client.sendMessage(number, `Mohon ditingakatkan kembali kinerjanya bapak-bapak/ibu-ibu *peringkat NTB* saat ini *${peringkat.find((val) => val.nama === "NTB").no}*`);
    // await client.sendMessage(number, MessageMedia.fromFilePath(path.join(__dirname,"../../image/rekapkinerja_kantah.png")));
    await client.sendMessage(number, MessageMedia.fromFilePath(path.join(__dirname, "../image/rekap_kuantitas.png")));
    await client.sendMessage(number, "Mohon *Ditingkatkan* untuk yang *persentase* capaiannya *masih rendah*");
    await client.sendMessage(number, "*Early Warning NTB*\nTerkait pengumuman kadaluarsa untuk segera ditindaklanjuti");
    await client.sendMessage(number, MessageMedia.fromFilePath(path.join(__dirname, "../image/early_warning.png")));
    await client.sendMessage(number, "#NTB_KINI_LEBIH_BAIK");


    var message = desaLengkap.map(desa => {
        return `${desa.kantah} = ${desa.jumlah}\n`
    }).toString().replaceAll(",", "");
    client.sendMessage(number, `*MONITORING DESA LENGKAP* \nJumlah Desa NDL ${jumlahDesa}\n${message}\nUntuk *info lebih* balas *'detaildesa'* tanpa tanda petik`);
    console.log('Terkirim ke :' + number);
}

module.exports = {
    sendReport
}