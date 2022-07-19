const today = new Date();
const yesterday = new Date(Date.now() - 864e5);
const third = new Date(Date.now() - 2*24*60*60*1000);
const todayLocal = `${today.getDay()}${today.getMonth()}${today.getFullYear()}`;
const yesterdayLocal = `${yesterday.getDay()}${yesterday.getMonth()}${yesterday.getFullYear()}`;
const thirddayLocal = `${third.getDay()}${third.getMonth()}${third.getFullYear()}`;

module.exports = {
    today,
    yesterday,
    third,
    todayLocal,
    yesterdayLocal,
    thirddayLocal
}