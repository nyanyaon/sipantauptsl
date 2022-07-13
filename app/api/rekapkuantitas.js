require('dotenv').config();
const axios = require('axios');
const nodeHtmlToImage = require('node-html-to-image');
const auth = require('./auth');


async function getData() {
    var token = require('./auth.json');
    console.log(token.id);
    var req = await axios({
        method: 'post',
        url: `${process.env.META_URL}/api/card/506/query/json`,
        headers: {
            'X-Metabase-Session': token.id
        }
    });
    const data = await req.data;

    table = data.map(val => {
        var pbtFix = (val.PersenPBT * 100).toFixed(2);
        var shatFix = (val.PersenSHAT * 100).toFixed(2);
        var pemetaanFix = (val.PersenPemetaan * 100).toFixed(2);
        var puldadisFix = (val.PersenPuldadis * 100).toFixed(2);
        var totalK4Fix = (val.PersenTotalK4 * 100).toFixed(2);
        var berkasFix = (val.PersenBerkas * 100).toFixed(2);
        return`
            <tr>
                <td>${val.Kantah}</td>
                <td style="background: #666666;color: #fff;text-align: center">${val.TargetPengukuran}</td>
                <td style="background: ${pemetaanFix > 80 ? '#00A805' : pemetaanFix > 60 ? '#30d507' : pemetaanFix > 40 ? '#AADB00' : pemetaanFix > 20 ? '#E0BD00' : '#FF2D37'};text-align: center">${pemetaanFix}%</td>
                <td style="background: ${pbtFix > 80 ? '#00A805' : pbtFix > 60 ? '#30d507' : pbtFix > 40 ? '#AADB00' : pbtFix > 20 ? '#E0BD00' : '#FF2D37'};text-align: center">${pbtFix}%</td>
                <td style="background: #666666;color: #fff;text-align: center">${val.TargetYuridis}</td>
                <td style="background: ${puldadisFix > 80 ? '#00A805' : puldadisFix > 60 ? '#30d507' : puldadisFix > 40 ? '#AADB00' : puldadisFix > 20 ? '#E0BD00' : '#FF2D37'};text-align: center">${puldadisFix}%</td>
                <td style="background: ${berkasFix > 80 ? '#00A805' : berkasFix > 60 ? '#30d507' : berkasFix > 40 ? '#AADB00' : berkasFix > 20 ? '#E0BD00' : '#FF2D37'};text-align: center">${berkasFix}%</td>
                <td style="background: ${shatFix > 80 ? '#00A805' : shatFix > 60 ? '#30d507' : shatFix > 40 ? '#AADB00' : shatFix > 20 ? '#E0BD00' : '#FF2D37'};text-align: center">${shatFix}%</td>
                <td style="background: #666666;color: #fff;text-align: center">${val.TargetK4}</td>
                <td style="background: ${totalK4Fix > 80 ? '#00A805' : totalK4Fix > 60 ? '#30d507' : totalK4Fix > 40 ? '#AADB00' : totalK4Fix > 20 ? '#E0BD00' : '#FF2D37'};text-align: center">${totalK4Fix}%</td>
            </tr>
    `});

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
        <h1>Kinerja Per Tahapan</h1>
        <table>
            <thead>
                <th>Kantah</th>
                <th>Target PBT</th>
                <th>Capaian Pemetaan</th>
                <th>Capaian PBT</th>
                <th>Target SHAT</th>
                <th>Capaian Puldadis</th>
                <th>Capaian Pemberkasan</th>
                <th>Capaian SHAT</th>
                <th>Target K4</th>
                <th>Capaian K4</th>
            </thead>
            <tbody id="table-body">` +
                table
            + `</tbody>
        </table>
    </body>
    </html>`;
    
    //render image
    nodeHtmlToImage({
        output: './rekapkuantitas.png',
        html: html
    }).then(() => console.log('Success'));
}


getData();