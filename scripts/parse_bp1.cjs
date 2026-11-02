const fs = require('fs');

const path = 'C:/Users/Jesse/.gemini/antigravity-ide/brain/68a17cf5-6727-477d-93bf-43c3c9374475/.system_generated/steps/342/content.md';
const content = fs.readFileSync(path, 'utf8');

const ogTitle = content.match(/<meta property=["']og:title["'] content=["'](.*?)["']/i);
const title = content.match(/<title>(.*?)<\/title>/i);
const h1 = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
const time = content.match(/<time[^>]*>([\s\S]*?)<\/time>/i);
const dateMeta = content.match(/<meta property=["']article:published_time["'] content=["'](.*?)["']/i);

console.log('OG Title:', ogTitle ? ogTitle[1] : 'null');
console.log('Title Tag:', title ? title[1] : 'null');
console.log('H1:', h1 ? h1[1].replace(/<[^>]+>/g, '').trim() : 'null');
console.log('Time:', time ? time[1].replace(/<[^>]+>/g, '').trim() : 'null');
console.log('DateMeta:', dateMeta ? dateMeta[1] : 'null');
