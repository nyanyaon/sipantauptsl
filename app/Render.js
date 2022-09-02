const fs = require('fs');
const path = require('path');
const nodeHtmlToImage = require('node-html-to-image');

const KANTAH = [
    "Kab. Lombok Barat",
    "Kab. Lombok Tengah",
    "Kab. Lombok Timur",
    "Kab. Sumbawa",
    "Kab. Dompu",
    "Kab. Bima",
    "Kota Mataram",
    "Kota Bima",
    "Kab. Sumbawa Barat",
    "Kab. Lombok Utara"
];

async function renderKinerja() {
    const dataKinerjaProv = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/peringkat.json')));
    let pos = dataKinerjaProv.findIndex((val) => val.nama === "NTB");
    let table = dataKinerjaProv.map((val, index) => {
        if (index < pos - 5 || index > pos + 5) {
            return;
        }
        var perencanaanFix = new Number(val.nilai_perencanaan.replace(",", "."));
        var kuantitasFix = new Number(val.nilai_kuantitas.replace(",", "."));
        var kualitasFix = new Number(val.nilai_kualitas.replace(",", "."));
        var kinerjaFix = new Number(val.nilai_kinerja.replace(",", "."));
        return `
            <tr>
                <td style="${val.nama === "NTB" ? 'background:#3CFA84;font-weight: 700;font-size:n 1.3em' : ''}">${val.no}</td>
                <td style="${val.nama === "NTB" ? 'background:#3CFA84;font-weight: 700;font-size: 1.3em' : ''}">${val.nama}</td>
                <td style="${val.nama === "NTB" ? 'font-weight: 700;font-size: 1.3em' : ''};background: ${perencanaanFix > 80 ? '#00A805' : perencanaanFix > 60 ? '#30d507' : perencanaanFix > 40 ? '#AADB00' : perencanaanFix > 20 ? '#E0BD00' : '#FF2D37'};text-align: center">${perencanaanFix}</td>
                <td style="${val.nama === "NTB" ? 'font-weight: 700;font-size: 1.3em' : ''};background: ${kuantitasFix > 80 ? '#00A805' : kuantitasFix > 60 ? '#30d507' : kuantitasFix > 40 ? '#AADB00' : kuantitasFix > 20 ? '#E0BD00' : '#FF2D37'};text-align: center">${kuantitasFix}</td>
                <td style="${val.nama === "NTB" ? 'font-weight: 700;font-size: 1.3em' : ''};background: ${kualitasFix > 80 ? '#00A805' : kualitasFix > 60 ? '#30d507' : kualitasFix > 40 ? '#AADB00' : kualitasFix > 20 ? '#E0BD00' : '#FF2D37'};text-align: center">${kualitasFix}</td>
                <td style="${val.nama === "NTB" ? 'font-weight: 700;font-size: 1.3em' : ''};background: ${kinerjaFix > 80 ? '#00A805' : kinerjaFix > 60 ? '#30d507' : kinerjaFix > 40 ? '#AADB00' : kinerjaFix > 20 ? '#E0BD00' : '#FF2D37'};text-align: center">${kinerjaFix}</td>
            </tr>
    `}).toString().replaceAll(",", "");

    var html = `<html>
    <head>
        <style>
            body {
                font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                margin: 0;
                padding: 0;
                font-size: 12px;
            }

            table {
                border-collapse: collapse;
                width: 100%;
            }

            table, th, td {
                border: 1px solid #2c2c2c;
            }

            th, td {
                padding: 0.5em;
            }

            h1 {
                text-align: center;
            }

            th {
                background: #4d2f00;
                font-weight: 700;
                color: #fff;
            }
        </style>
    </head>
    <body>
        <h1>Kinerja PTSL Nasional</h1>
        <table>
            <thead>
                <th>No</th>
                <th>Provinsi</th>
                <th>Nilai Perencanaan Tahun Berjalan</th>
                <th>Nilai Kuantitas</th>
                <th>Nilai Kualitas</th>
                <th>Nilai Kinerja</th>
            </thead>
            <tbody id="table-body">
                ${table}
            </tbody>
        </table>
    </body>
    </html>`;

    //render image
    await nodeHtmlToImage({
        output: __dirname + '/../image/rekapkinerja.png',
        html: html
    });
}

async function renderKinerjaKantah() {
    const dataKinerjaKantah = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/kinerjakantah.json')));
    let table = dataKinerjaKantah.map((val) => {
        var perencanaanFix = new Number(val.nilai_perencanaan.replace(',', '.')).toFixed(2);
        var kualitasFix = new Number(val.nilai_kualitas.replace(',', '.')).toFixed(2);
        var kuantitasFix = new Number(val.nilai_kuantitas.replace(',', '.')).toFixed(2);
        var kinerjaFix = new Number(val.nilai_kinerja.replace(',', '.')).toFixed(2);
        return `
            <tr>
                <td>${val.no}</td>
                <td>${val.nama}</td>
                <td style="background: ${perencanaanFix > 80 ? '#00A805' : perencanaanFix > 60 ? '#30d507' : perencanaanFix > 40 ? '#AADB00' : perencanaanFix > 20 ? '#E0BD00' : '#FF2D37'};text-align: center">${perencanaanFix}%</td>
                <td style="background: ${kuantitasFix > 80 ? '#00A805' : kuantitasFix > 60 ? '#30d507' : kuantitasFix > 40 ? '#AADB00' : kuantitasFix > 20 ? '#E0BD00' : '#FF2D37'};text-align: center">${kuantitasFix}%</td>
                <td style="background: ${kualitasFix > 80 ? '#00A805' : kualitasFix > 60 ? '#30d507' : kualitasFix > 40 ? '#AADB00' : kualitasFix > 20 ? '#E0BD00' : '#FF2D37'};text-align: center">${kualitasFix}%</td>
                <td style="background: ${kinerjaFix > 80 ? '#00A805' : kinerjaFix > 60 ? '#30d507' : kinerjaFix > 40 ? '#AADB00' : kinerjaFix > 20 ? '#E0BD00' : '#FF2D37'};text-align: center">${kinerjaFix}%</td>
            </tr>
    `}).toString().replaceAll(",", "");

    var html = `<html>
    <head>
        <style>
            body {
                font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                margin: 0;
                padding: 0;
                font-size: 12px;
            }

            table {
                border-collapse: collapse;
                width: 100%;
            }

            h1 {
                text-align: center;
            }

            table, th, td {
                border: 1px solid #2c2c2c;
            }

            th, td {
                padding: 0.5em;
            }

            th {
                background: #4d2f00;
                font-weight: 700;
                color: #fff;
            }
        </style>
    </head>
    <body>
        <h1>Kinerja PTSL Kantah NTB</h1>
        <table>
            <thead>
                <th>No</th>
                <th>Nama Kantah</th>
                <th>Nilai Perencanaan Tahun Berjalan</th>
                <th>Nilai Kuantitas</th>
                <th>Nilai Kualitas</th>
                <th>Nilai Kinerja</th>
            </thead>
            <tbody id="table-body"> ${table} </tbody>
        </table>
    </body>
    </html>`;

    //render image
    await nodeHtmlToImage({
        output: __dirname + '/../image/rekapkinerja_kantah.png',
        html: html
    });
}

async function renderEarlyWarning() {
    const dataEarlyWarning = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/earlywarning.json')));
    let table = dataEarlyWarning.map((val) => {
        return `
            <tr>
                <td>${val.no}</td>
                <td>${val.kantah}</td>
                <td>${val.jumlah}</td>
            </tr>`
    }).toString().replaceAll(",", "");

    var html = `
    <html>
    <head>
        <style>
            body {
                font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                margin: 0;
                padding: 0;
                font-size: 12px;
            }

            h1 {
                text-align: center;
            }

            table {
                border-collapse: collapse;
                width: 100%;
            }

            table, th, td {
                border: 1px solid #2c2c2c;
            }

            th, td {
                padding: 0.5em;
            }

            th {
                background: #4d2f00;
                font-weight: 700;
                color: #fff;
            }
        </style>
    </head>
    <body>
        <h1>Pengumuman Kadaluarsa</h1>
        <table>
            <thead>
                <th>No</th>
                <th>Nama Kantah</th>
                <th>Jumlah</th>
            </thead>
            <tbody id="table-body"> ${table} </tbody>
        </table>
    </body>
    </html>`;

    //render image
    await nodeHtmlToImage({
        output: __dirname + '/../image/early_warning.png',
        html: html
    });
}

async function renderKuantitas() {
    const dataKinerjaTahapan = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/rekaptahapan.json')));
    const dataKuantitas = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/rekapkuantitas.json')));
    let data = dataKuantitas.map(val => {
        let o = val;
        o.sertifikat = dataKinerjaTahapan[dataKinerjaTahapan.findIndex(x => x.kantah == o.kantah)].sertifikat;
        o.penyerahan = dataKinerjaTahapan[dataKinerjaTahapan.findIndex(x => x.kantah == o.kantah)].penyerahan;
        return o;
    });

    let table = data.map(val => {
        if(val.kantah == 'Total') {
            return;
        }

        var capaianPBT = new Number(val.capaianpbt);
        var capaianSHAT = new Number(val.capaianshat);
        var capaianK4 = new Number(val.capaiank4);
        var surveyFix = ((val.survei / val.targetpbt) * 100).toFixed(2);
        var pemetaanFix = ((val.pemetaan / val.targetpbt) * 100).toFixed(2);
        var puldadisFix = ((val.puldadis / val.targetshat) * 100).toFixed(2);
        var pemberkasanFix = ((val.pemberkasan / val.targetshat) * 100).toFixed(2);
        return `
            <tr>
                <td>${val.kantah}</td>
                <td style="background: #666666;color: #fff;text-align: center">${val.targetpbt}</td>
                <td style="background: ${surveyFix > 80 ? '#00A805' : surveyFix > 60 ? '#30d507' : surveyFix > 40 ? '#AADB00' : surveyFix > 20 ? '#E0BD00' : '#ff8585'};text-align: center">${surveyFix}%</td>
                <td style="background: ${pemetaanFix > 80 ? '#00A805' : pemetaanFix > 60 ? '#30d507' : pemetaanFix > 40 ? '#AADB00' : pemetaanFix > 20 ? '#E0BD00' : '#ff8585'};text-align: center">${pemetaanFix}%</td>
                <td style="background: ${capaianPBT > 80 ? '#00A805' : capaianPBT > 60 ? '#30d507' : capaianPBT > 40 ? '#AADB00' : capaianPBT > 20 ? '#E0BD00' : '#ff8585'};text-align: center">${capaianPBT}%</td>
                <td style="background: #666666;color: #fff;text-align: center">${val.targetshat}</td>
                <td style="background: ${puldadisFix > 80 ? '#00A805' : puldadisFix > 60 ? '#30d507' : puldadisFix > 40 ? '#AADB00' : puldadisFix > 20 ? '#E0BD00' : '#ff8585'};text-align: center">${puldadisFix}%</td>
                <td style="background: ${pemberkasanFix > 80 ? '#00A805' : pemberkasanFix > 60 ? '#30d507' : pemberkasanFix > 40 ? '#AADB00' : pemberkasanFix > 20 ? '#E0BD00' : '#ff8585'};text-align: center">${pemberkasanFix}%</td>
                <td style="background: ${capaianSHAT > 80 ? '#00A805' : capaianSHAT > 60 ? '#30d507' : capaianSHAT > 40 ? '#AADB00' : capaianSHAT > 20 ? '#E0BD00' : '#ff8585'};text-align: center">${capaianSHAT}%</td>
                <td style="text-align: center">${val.sertifikat}</td>
                <td style="text-align: center">${val.potensiK1}</td>
                <td style="text-align: center">${val.K1}</td>
                <td style="background: #666666;color: #fff;text-align: center">${val.targetk4}</td>
                <td style="background: ${capaianK4 > 80 ? '#00A805' : capaianK4 > 60 ? '#30d507' : capaianK4 > 40 ? '#AADB00' : capaianK4 > 20 ? '#E0BD00' : '#ff8585'};text-align: center">${capaianK4}%</td>
            </tr>
    `}).toString().replaceAll(",", "");

    let totalHtml = `
    <tr>
        <td style="background: #4d2f00;color:#fff;font-weight: 700;text-align: center;">Total</td>
        <td style="background: #4d2f00;color:#fff;font-weight: 700;text-align: center;">${data[data.length - 1].targetpbt}</td>
        <td style="background: #4d2f00;color:#fff;font-weight: 700;text-align: center;">${((data[data.length - 1].survei / data[data.length - 1].targetpbt) * 100).toFixed(2) }%</td>
        <td style="background: #4d2f00;color:#fff;font-weight: 700;text-align: center;">${(data[data.length - 1].pemetaan / data[data.length - 1].targetpbt * 100).toFixed(2)} %</td>
        <td style="background: #4d2f00;color:#fff;font-weight: 700;text-align: center;">${new Number(data[data.length - 1].capaianpbt)} %</td>
        <td style="background: #4d2f00;color:#fff;font-weight: 700;text-align: center;">${data[data.length - 1].targetshat}</td>
        <td style="background: #4d2f00;color:#fff;font-weight: 700;text-align: center;">${(data[data.length - 1].puldadis / data[data.length - 1].targetshat * 100).toFixed(2)} %</td>
        <td style="background: #4d2f00;color:#fff;font-weight: 700;text-align: center;">${(data[data.length - 1].pemberkasan / data[data.length - 1].targetshat * 100).toFixed(2)} %</td>
        <td style="background: #4d2f00;color:#fff;font-weight: 700;text-align: center;">${new Number(data[data.length - 1].capaianshat)} %</td>
        <td style="background: #4d2f00;color:#fff;font-weight: 700;text-align: center;">${data[data.length - 1].sertifikat}</td>
        <td style="background: #4d2f00;color:#fff;font-weight: 700;text-align: center;">${data[data.length - 1].potensiK1}</td>
        <td style="background: #4d2f00;color:#fff;font-weight: 700;text-align: center;">${data[data.length - 1].K1}</td>
        <td style="background: #4d2f00;color:#fff;font-weight: 700;text-align: center;">${data[data.length - 1].targetk4}</td>
        <td style="background: #4d2f00;color:#fff;font-weight: 700;text-align: center;">${new Number(data[data.length - 1].capaiank4)} %</td>
    </tr>
    `

    var html = `
    <html>
    <head>
        <style>
            body {
                font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                margin: 0;
                padding: 0;
                width: 1366px;
                height: 820px;
                font-size: 12px;
            }

            table {
                border-collapse: collapse;
                width: 100%;
            }

            h1 {
                text-align: center;
            }

            table, th, td {
                border: 0px solid #dedede;
            }

            th, td {
                padding: 0.5em;
            }

            th {
                background: #4d2f00;
                font-weight: 700;
                color: #fff;
            }
        </style>
    </head>
    <body>
        <h1>Kinerja Per Tahapan</h1>
        <table>
            <thead>
                <th>Kantah</th>
                <th>Target PBT</th>
                <th>Capaian Survey</th>
                <th>Capaian Pemetaan</th>
                <th>Capaian PBT</th>
                <th>Target SHAT</th>
                <th>Capaian Puldadis</th>
                <th>Capaian Pemberkasan</th>
                <th>Capaian SHAT</th>
                <th>Sertifikat</th>
                <th>Potensi K1</th>
                <th>K1</th>
                <th>Target K4</th>
                <th>Capaian K4</th>
            </thead>
            <tbody id="table-body">` +
        table
        + totalHtml + `</tbody>
        </table>
    </body>
    </html>`;

    //render image
    await nodeHtmlToImage({
        output: __dirname + '/../image/rekap_kuantitas.png',
        html: html
    });
}

async function renderDesaNDL(kantah) {
    const dataDetailDesa = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/detaildesalengkap.json')));
    let table = dataDetailDesa.filter(desa => desa.kantah === kantah).map(val => {
        var batasMinimal = new Number(val.luas * 0.99995);
        var batasMaksimal = new Number(val.luas * 1.00005);
        var syaratLuas = val.luasPersil > batasMinimal && val.luasPersil < batasMaksimal ? 'Memenuhi' : 'Tidak Memenuhi';
        var batasBidangKW = val.jumlahBt * 0.05;
        var syaratBidangKW = val.jumlahKW456 <= batasBidangKW ? 'Memenuhi' : 'Tidak Memenuhi';
        var maksimalLuasKW = val.luasPersil * 0.035;
        var syaratLuasKW = val.luasKW456 <= maksimalLuasKW ? 'Memenuhi' : 'Tidak Memenuhi';
        var ndl = val.NDL;
        return `
            <tr>
                <td>${val.no}</td>
                <td>${val.desa}</td>
                <td>${val.luasPersil}</td>
                <td>${batasMinimal.toFixed(2)}</td>
                <td>${batasMaksimal.toFixed(2)}</td>
                <td style="${syaratLuas === "Memenuhi" ? "background: green;" : "background: red;"}">${syaratLuas}</td>
                <td>${val.jumlahKW456}</td>
                <td>${batasBidangKW.toFixed(0)}</td>
                <td style="${syaratBidangKW === "Memenuhi" ? "background: green;" : "background: red;"}">${syaratBidangKW}</td>
                <td>${val.luasKW456}</td>
                <td>${maksimalLuasKW.toFixed(2)}</td>
                <td style="${syaratLuasKW === "Memenuhi" ? "background: green;" : "background: red;"}">${syaratLuasKW}</td>
                <td>${ndl}</td>
            </tr>
    `}).toString().replaceAll(",", "");

    var html = `
    <html>
    <head>
        <style>
            body {
                font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                margin: 0;
                padding: 0;
                font-size: 12px;
                width: 1280px;
                height: 720px;
            }

            table {
                border-collapse: collapse;
                width: 100%;
            }

            h1 {
                text-align: center;
            }

            table, th, td {
                border: 1px solid #2c2c2c;
            }

            th, td {
                padding: 0.5em;
            }

            th {
                background: #4d2f00;
                font-weight: 700;
                color: #fff;
            }
        </style>
    </head>
    <body>
        <h1>Analisis Kualitas ${kantah}</h1>
        <table>
            <thead>
                <th>No</th>
                <th>Desa</th>
                <th>Luas Persil</th>
                <th>Batas Minimal</th>
                <th>Batas Maksimal</th>
                <th>Syarat Luas</th>
                <th>Jumlah KW456</th>
                <th>Batas Jumlah Bidang KW456</th>
                <th>Syarat Jumlah KW456</th>
                <th>Luas KW456</th>
                <th>Batas Maksimal Luas KW456</th>
                <th>Syarat Luas KW456</th>
                <th>NDL</th>
            </thead>
            <tbody id="table-body">
                ${table}
            </tbody>
        </table>
    </body>
    </html>`;

    //render image
    await nodeHtmlToImage({
        output: __dirname + '/../image/potensidesalengkap/' + kantah.trim() + '.png',
        html: html
    });
}


module.exports = {
    KANTAH,
    renderDesaNDL,
    renderEarlyWarning,
    renderKinerja,
    renderKinerjaKantah,
    renderKuantitas
}