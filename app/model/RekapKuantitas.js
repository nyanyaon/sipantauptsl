/**
 * @class RekapKuantitas
 * this is a model that get from progress
 */
class RekapKuantitas {
    constructor(
        no,
        wilayah,
        targetpbt,
        targetshat,
        targetk4,
        survei,
        pemetaan,
        puldadis,
        pemberkasan,
        potensik1,
        k1,
        k2,
        k31,
        k32,
        k33,
        k34,
        k4,
        k42,
        kw456,
        siapdiserahkan,
        diserahkan,
        k1pbtsebelumnya,
        capaianpbt,
        capaianshat,
        capaiank4,
    ) {
        this.no = no;
        this.wilayah = wilayah; 
        this.targetpbt = targetpbt;
        this.targetshat = targetshat;
        this.targetk4 = targetk4;
        this.survei = survei;
        this.pemetaan = pemetaan;
        this.puldadis = puldadis;
        this.pemberkasan = pemberkasan;
        this.potensik1 = potensik1;
        this.k1 = k1;
        this.k2 = k2;
        this.k31 = k31;
        this.k32 = k32;
        this.k33 = k33;
        this.k34 = k34;
        this.k4 = k4;
        this.k42 = k42;
        this.kw456 = kw456;
        this.siapdiserahkan = siapdiserahkan; 
        this.diserahkan = diserahkan;
        this.k1pbtsebelumnya = k1pbtsebelumnya;
        this.capaianpbt = capaianpbt;
        this.capaianshat = capaianshat;
        this.capaiank4 = capaiank4;
        this.date = new Date();
    }
}

module.exports = RekapKuantitas;