require('dotenv').config();
const axios = require('axios');

var postData = {
    "username": "spkaltim@atrbpn.go.id",
    "password": "kalt1mval1d"
}

var path = '/api/session';


async function getAuth() {
    auth = await axios.post(process.env.META_URL+path, postData).then(res => res.data.id);

    var json = JSON.stringify({
        id: auth
    });
    var fs = require('fs');
    fs.writeFileSync('auth.json', json, 'utf8');
}

getAuth();