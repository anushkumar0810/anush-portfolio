const fs = require('fs');
const path = require('path');
const https = require('https');

const behanceUrls = [
    { name: 'behance_real_estate', url: 'https://www.behance.net/gallery/235984763/Real-Estate-Themes-By-Anush-Kumar' },
    { name: 'behance_helpora', url: 'https://www.behance.net/gallery/236519995/Helpora-AI-Website-By-Anush-Kumar' },
    { name: 'behance_menus', url: 'https://www.behance.net/gallery/236047673/Hotel-Restaurant-Menus-By-Anush-Kumar' },
    { name: 'behance_figma', url: 'https://www.behance.net/gallery/241182223/Figma-Posters' },
    { name: 'behance_photoshop', url: 'https://www.behance.net/gallery/241182529/Photoshop-Posters' },
    { name: 'behance_android14', url: 'https://www.behance.net/gallery/241412451/14-Limited-Access' }
];

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else {
                // Consume response data to free up memory
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
            }
        });
    });
};

async function fetchThumbnail(projectInfo) {
    return new Promise((resolve, reject) => {
        https.get(projectInfo.url, (res) => {
            let data = '';
            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', async () => {
                const ogImageMatch = data.match(/<meta property="og:image" content="([^"]+)"/i);
                if (ogImageMatch && ogImageMatch[1]) {
                    const imageUrl = ogImageMatch[1].replace(/&amp;/g, '&');
                    const ext = path.extname(new URL(imageUrl).pathname) || '.jpg';
                    const filename = `${projectInfo.name}${ext}`;
                    const filepath = path.join('c:\\Users\\anush\\.gemini\\antigravity\\scratch\\anush_kumar_personal_portfolio', filename);

                    try {
                        await downloadImage(imageUrl, filepath);
                        console.log(`Downloaded ${filename}`);
                        resolve({ name: projectInfo.name, filename });
                    } catch (e) {
                        console.error(`Error downloading ${imageUrl}: ${e.message}`);
                        resolve(null);
                    }
                } else {
                    console.error(`No og:image found for ${projectInfo.url}`);
                    resolve(null);
                }
            });
        }).on('error', err => {
            console.error(`Error fetching ${projectInfo.url}:`, err.message);
            resolve(null);
        });
    });
}

async function run() {
    const results = await Promise.all(behanceUrls.map(fetchThumbnail));
    console.log('Results:', JSON.stringify(results, null, 2));
}

run();
