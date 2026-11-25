const fs = require('fs');

let code = fs.readFileSync('scripts/build_pages.cjs', 'utf8');
const target = `'https://curitipao.com.br/roteiros/padarias-em-curitiba-por-bairro/',`;
const addition = `'https://curitipao.com.br/roteiros/padarias-em-curitiba-por-bairro/',\n  'https://curitipao.com.br/roteiros/onde-comer-croissant-em-curitiba/',`;

if (code.includes(target)) {
  code = code.replace(target, addition);
  // Also update priority line
  const priorityTarget = `(url.includes('/padarias-em-curitiba-por-bairro/') ? '0.9' : '0.8')`;
  const priorityAddition = `(url.includes('/padarias-em-curitiba-por-bairro/') || url.includes('/onde-comer-croissant-em-curitiba/') ? '0.9' : '0.8')`;
  if (code.includes(priorityTarget)) {
    code = code.replace(priorityTarget, priorityAddition);
  }
  fs.writeFileSync('scripts/build_pages.cjs', code, 'utf8');
  console.log('Successfully updated build_pages.cjs with croissant URL in sitemap and priority!');
} else {
  console.error('Target not found in build_pages.cjs');
  process.exit(1);
}
