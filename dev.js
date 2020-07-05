var Scraper = require('images-scraper');
const sirv = require('sirv');
const send = require('@polka/send-type');
const polka = require('polka');
const compress = require('compression')();
const cors = require('cors');

const baseURL = "http://localhost:333/img/"
const google = new Scraper({
    puppeteer: {
        headless: true,
        detail: false,
    },
    tbs: {
        isz: "l",
        sur: "f"
    }
});

async function getImages() {
    const results = await google.scrape('biryani rice', 50);
    console.log(results);
    return results
}
const assets = sirv('public', {
    maxAge: 31536000, // 1Y
    immutable: true
});
polka()
    .use(cors())
    .use(compress, assets)
    .get('/new', async (req, res) => {
        let data = await getImages().catch(err => {
            send(res, 404);
        });
        let biriyanis = Object.values(data)
        const randombiriyani = biriyanis[parseInt(Math.random() * biriyanis.length)]
        console.log(randombiriyani)
        send(res, 200, data);
    })
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