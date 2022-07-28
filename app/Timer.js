
class Timer {
    constructor() {
        this.date = new Date();
    }

    today() {
        return this.date;
    }

    yesterday() {
        let datetime = new Date(Date.now() - 24*60*60*1000);
        return datetime;
    }
}

module.exports = Timer;