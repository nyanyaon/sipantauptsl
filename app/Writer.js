module.exports.toJson = function (data, name) {
    var fs = require('fs');
    var path = require('path');
    fs.writeFileSync(path.join(__dirname, '../data/', name+'.json'), JSON.stringify(data), 'utf8');
}