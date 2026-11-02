const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('../curitipao-2026/index.html', 'utf8');

const cardRegex = /<article class="card">([\s\S]*?)<\/article>/g;
let match;
const bakeries = [];

while ((match = cardRegex.exec(html)) !== null) {
  const cardHtml = match[1];
  const nameMatch = cardHtml.match(/<h3>(.*?)<\/h3>/);
  const name = nameMatch ? nameMatch[1].trim() : '';
  const productMatch = cardHtml.match(/<p class="product-name">Produto:\s*(.*?)<\/p>/);
  const product = productMatch ? productMatch[1].trim() : '';
  const descMatch = cardHtml.match(/<p>Descrição:\s*(.*?)<\/p>/);
  const description = descMatch ? descMatch[1].trim() : '';
  const priceMatch = cardHtml.match(/<p class="price">Preço:\s*(.*?)<\/p>/);
  const price = priceMatch ? priceMatch[1].trim() : '';
  const addrMatch = cardHtml.match(/<p>Endereço:\s*(.*?)<\/p>/);
  const address = addrMatch ? addrMatch[1].trim() : '';
  const hoursMatch = cardHtml.match(/<p>Horário:\s*(.*?)<\/p>/);
  const hours = hoursMatch ? hoursMatch[1].trim() : '';
  const instaMatch = cardHtml.match(/href="(https:\/\/instagram\.com\/[^"]+)"/);
  const instagram = instaMatch ? instaMatch[1] : '';
  const handleMatch = cardHtml.match(/<span class="insta-handle">(.*?)<\/span>/);
  const instaHandle = handleMatch ? handleMatch[1].trim() : '';

  // Images
  const imgRegex = /<img src="([^"]+)" alt="([^"]+)"/g;
  let imgMatch;
  const photos = [];
  while ((imgMatch = imgRegex.exec(cardHtml)) !== null) {
    if (!imgMatch[1].includes('Instagram_icon')) {
      photos.push({ src: imgMatch[1], alt: imgMatch[2] });
    }
  }

  // Units
  const units = [];
  const unitRegex = /<li class="unit-item">([\s\S]*?)<\/li>/g;
  let uMatch;
  while ((uMatch = unitRegex.exec(cardHtml)) !== null) {
    const uHtml = uMatch[1];
    const uBadge = uHtml.match(/<span class="unit-badge">(.*?)<\/span>/);
    const uAddr = uHtml.match(/data-address="([^"]+)"/);
    const uHours = uHtml.match(/<span class="unit-hours">(.*?)<\/span>/);
    units.push({
      badge: uBadge ? uBadge[1].trim() : '',
      address: uAddr ? uAddr[1].trim() : '',
      hours: uHours ? uHours[1].trim() : ''
    });
  }

  let neighborhood = '';
  if (address.includes('–')) {
    neighborhood = address.split('–').pop().trim();
  } else if (address.includes('-')) {
    neighborhood = address.split('-').pop().trim();
  } else if (units.length > 0) {
    neighborhood = units.map(u => u.badge).join(', ');
  }

  bakeries.push({
    name,
    neighborhood,
    product,
    description,
    price,
    address,
    hours,
    instagram,
    instaHandle,
    photos,
    units
  });
}

console.log('Extracted bakeries count:', bakeries.length);
if (!fs.existsSync('./assets/data')) fs.mkdirSync('./assets/data', { recursive: true });
fs.writeFileSync('./assets/data/bakeries_2026.json', JSON.stringify(bakeries, null, 2), 'utf8');
console.log('Saved to ./assets/data/bakeries_2026.json');
