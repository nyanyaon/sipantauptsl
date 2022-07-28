const db = require('./database/Database');
const timer = require('./Timer');

function main() {
    // db.getAll("peringkat", diffPeringkat);
    db.getAll("detaildesalengkap", lockNDL);
}

function diffPeringkat(data) {
    let yesterdayData = data.filter(o => new Date(o.time).toLocaleDateString() == timer.yesterday.toLocaleDateString())[0];
    let todayData = data.filter(o => new Date(o.time).toLocaleDateString() == timer.today.toLocaleDateString())[0];
    let yestPeringkat = JSON.parse(yesterdayData.data);
    let todayPeringkat = JSON.parse(todayData.data);
    let yestNTB = yestPeringkat.filter(v => v.nama === 'NTB')[0];
    let todayNTB = todayPeringkat.filter(v => v.nama === 'NTB')[0];
    
    let deltaPeringkatNTB = todayNTB.no - yestNTB.no;

    if( deltaPeringkatNTB > 0 ) {
        let kuantitas = todayNTB.nilai_kuantitas.replace(",", ".") - yestNTB.nilai_kuantitas.replace(",", ".");
        let kualitas = todayNTB.nilai_kualitas.replace(",", ".") - yestNTB.nilai_kualitas.replace(",", ".");
        let kinerja = todayNTB.nilai_kinerja.replace(",", ".") - yestNTB.nilai_kinerja.replace(",", ".");
        console.log(`
            Kuantias NTB: ${kuantitas.toFixed(2)}
            Kualitas NTB: ${kualitas.toFixed(2)}
            Kinerja NTB: ${kinerja.toFixed(2)}
        `)
        db.getAll("detaildesalengkap", searchDesaLengkap);
    } else if( deltaPeringkatNTB < 0 ) {
        aprreciate()
    }
}

function searchDesaLengkap(data) {
    let yesterdayData = data.filter(o => new Date(o.time).toLocaleDateString() == timer.yesterday.toLocaleDateString())[0];
    let todayData = data.filter(o => new Date(o.time).toLocaleDateString() == timer.today.toLocaleDateString())[0];
    let yestDetailDesa = JSON.parse(yesterdayData.data);
    let todayDetailDesa = JSON.parse(todayData.data);

    for(let i = 0; i < todayDetailDesa.length; i++) {
        console.log(`${todayDetailDesa[i].desa} dengan ndl ${todayDetailDesa[i].NDL - yestDetailDesa[i].NDL}`)
    }
}

function lockNDL(data) {
    let todayData = data.filter(o => new Date(o.time).toLocaleDateString() == timer.today.toLocaleDateString())[0];
    let todayDetailDesa = JSON.parse(todayData.data);
    let jumlahNDL = 0;
    let potensiNDL = 0;
    todayDetailDesa.forEach(desa => {
        let batasMinimal = new Number(desa.luas * 0.99995);
        let batasMaksimal = new Number(desa.luas * 1.00005);
        let syaratLuas = desa.luasPersil > batasMinimal && desa.luasPersil < batasMaksimal ? true : false;
        let batasBidangKW = desa.jumlahBt * 0.05;
        let syaratBidangKW = desa.jumlahKW456 <= batasBidangKW ? true : false;
        let maksimalLuasKW = desa.luasPersil * 0.035;
        let syaratLuasKW = desa.luasKW456 <= maksimalLuasKW ? true : false;
        if(new Number(desa.NDL) > 0) {
            jumlahNDL++;
        }

        if(syaratLuasKW && syaratBidangKW) {
            potensiNDL++;
            console.log(desa.desa);
        }
    });
    console.log(potensiNDL);
}

main();