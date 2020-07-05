const sirv = require('sirv');
const send = require('@polka/send-type');
const polka = require('polka');
const compress = require('compression')();
const cors = require('cors');
const expressGoogleAnalytics = require('express-google-analytics');
const slowDown = require("express-slow-down");


const analytics = expressGoogleAnalytics('UA-171692890-1');
const baseURL = "https://biriyani.anoram.com/img/"

const assets = sirv('public', {
    maxAge: 31536000, // 1Y
    immutable: true
});
const ratelimit = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 5, // allow 5 requests to go at full-speed, then...
    delayMs: 100 // 6th request has a 100ms delay, 7th has a 200ms delay, 8th gets 300ms, etc.
});
polka()
    .use("trust proxy")
    .use(cors())
    .use(analytics)
    .use(compress, assets)
    .use(ratelimit)
    .get('/get', (req, res) => {
        let biriyanis = 21
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