const sirv = require('sirv');
const send = require('@polka/send-type');
const polka = require('polka');
const compress = require('compression')();
const cors = require('cors');

const baseURL = "https://biriyani.anoram.com/img/"

const assets = sirv('public', {
    maxAge: 31536000, // 1Y
    immutable: true
});
polka()
    .use(cors())
    .use(compress, assets)
    
    .get('/get', (req, res) => {
        let biriyanis = 22
        const randombiriyani = Math.floor(Math.random() * (biriyanis - 1) + 1);
        let data = {
            "image": `${baseURL}${randombiriyani}.jpg`,
        }
        console.log(data);
        send(res, 200, data);
    })
    .listen(333, err => {
        if (err) throw err;
        console.log(`> Running on http://localhost:333`);
    });