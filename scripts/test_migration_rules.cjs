const fs = require('fs');
const path = require('path');

console.log('========================================================');
console.log('APACHE / LITESPEED MIGRATION REWRITE RULES TEST SUITE');
console.log('========================================================');

// 1. Read Subdomain .htaccess
const subdomainHtaccessPath = path.resolve('deploy/servidor_antigo_subdominio_conexus/.htaccess');
const subdomainHtaccess = fs.readFileSync(subdomainHtaccessPath, 'utf8');

// Parse RewriteRules from htaccess
function parseRules(content) {
  const lines = content.split('\n');
  const rules = [];
  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('#') || !line.startsWith('RewriteRule')) continue;
    const parts = line.split(/\s+/);
    if (parts.length >= 3) {
      const pattern = parts[1];
      const target = parts[2];
      const flags = parts[3] || '';
      rules.push({ pattern: new RegExp(pattern), target, flags, rawPattern: pattern });
    }
  }
  return rules;
}

const subdomainRules = parseRules(subdomainHtaccess);
console.log(`Parsed ${subdomainRules.length} RewriteRules from subdomain .htaccess:\n`);
subdomainRules.forEach(r => console.log(`  Rule: ${r.rawPattern.padEnd(30)} -> ${r.target} ${r.flags}`));

// Emulate Apache mod_rewrite execution on a given URI
function evaluateSubdomainUrl(uriString) {
  // Strip protocol and domain if present
  let urlObj;
  try {
    urlObj = new URL(uriString, 'https://curitipao.conexus.press');
  } catch (e) {
    urlObj = { pathname: uriString, search: '' };
  }

  // Apache per-directory rewrite removes leading slash before matching
  let testPath = urlObj.pathname.replace(/^\//, '');
  const query = urlObj.search ? urlObj.search.replace(/^\?/, '') : '';

  for (const rule of subdomainRules) {
    const match = testPath.match(rule.pattern);
    if (match) {
      if (rule.flags.includes('R=404')) {
        return { status: 404, location: null, matchedPattern: rule.rawPattern };
      }

      let dest = rule.target;
      // Replace capture groups $1, $2, etc.
      for (let i = 1; i < match.length; i++) {
        dest = dest.replace(new RegExp(`\\$${i}`, 'g'), match[i] || '');
      }

      // Handle QSA
      if (rule.flags.includes('QSA') && query) {
        dest += (dest.includes('?') ? '&' : '?') + query;
      }

      const status = rule.flags.includes('R=301') ? 301 : 200;
      return { status, location: dest, matchedPattern: rule.rawPattern };
    }
  }

  // If no rule matched
  return { status: 404, location: null, matchedPattern: 'default-unmatched' };
}

// Test cases
const testCases = [
  // 1. Root & index.html
  { input: 'https://curitipao.conexus.press/', expStatus: 301, expLocation: 'https://curitipao.com.br/festival/2026/' },
  { input: 'https://curitipao.conexus.press/index.html', expStatus: 301, expLocation: 'https://curitipao.com.br/festival/2026/' },
  { input: 'https://curitipao.conexus.press/?utm_source=qrcode&utm_campaign=festival2026', expStatus: 301, expLocation: 'https://curitipao.com.br/festival/2026/?utm_source=qrcode&utm_campaign=festival2026' },
  { input: 'https://curitipao.conexus.press/index.html?origem=panfleto', expStatus: 301, expLocation: 'https://curitipao.com.br/festival/2026/?origem=panfleto' },

  // 2. Privacy Policy
  { input: 'https://curitipao.conexus.press/politica-de-privacidade.html', expStatus: 301, expLocation: 'https://curitipao.com.br/privacidade/' },
  { input: 'https://curitipao.conexus.press/politica-de-privacidade.html?ref=footer', expStatus: 301, expLocation: 'https://curitipao.com.br/privacidade/?ref=footer' },

  // 3. Sitemap & Robots
  { input: 'https://curitipao.conexus.press/sitemap.xml', expStatus: 301, expLocation: 'https://curitipao.com.br/sitemap.xml' },
  { input: 'https://curitipao.conexus.press/robots.txt', expStatus: 301, expLocation: 'https://curitipao.com.br/robots.txt' },

  // 4. Styles, Scripts & Favicons
  { input: 'https://curitipao.conexus.press/style.css', expStatus: 301, expLocation: 'https://curitipao.com.br/festival/2026/style.css' },
  { input: 'https://curitipao.conexus.press/main.js', expStatus: 301, expLocation: 'https://curitipao.com.br/festival/2026/main.js' },
  { input: 'https://curitipao.conexus.press/favicon.ico', expStatus: 301, expLocation: 'https://curitipao.com.br/favicon.ico' },
  { input: 'https://curitipao.conexus.press/favicon.png', expStatus: 301, expLocation: 'https://curitipao.com.br/favicon.png' },
  { input: 'https://curitipao.conexus.press/apple-touch-icon.png', expStatus: 301, expLocation: 'https://curitipao.com.br/apple-touch-icon.png' },

  // 5. Assets mapping
  { input: 'https://curitipao.conexus.press/assets/photos/curitipao-111.jpg', expStatus: 301, expLocation: 'https://curitipao.com.br/assets/photos/curitipao-111.jpg' },
  { input: 'https://curitipao.conexus.press/assets/photos/aquarius-cortado.webp', expStatus: 301, expLocation: 'https://curitipao.com.br/assets/photos/aquarius-cortado.webp' },
  { input: 'https://curitipao.conexus.press/assets/logos/curitipao-logo.png', expStatus: 301, expLocation: 'https://curitipao.com.br/assets/logos/curitipao-logo.png' },
  { input: 'https://curitipao.conexus.press/assets/press/ric-noticias-manha-frame.jpg', expStatus: 301, expLocation: 'https://curitipao.com.br/assets/press/ric-noticias-manha-frame.jpg' },

  // 6. Unknown paths MUST NOT redirect to festival/2026/ or home: MUST return 404
  { input: 'https://curitipao.conexus.press/rota-desconhecida', expStatus: 404, expLocation: null },
  { input: 'https://curitipao.conexus.press/admin', expStatus: 404, expLocation: null },
  { input: 'https://curitipao.conexus.press/wp-login.php', expStatus: 404, expLocation: null },
  { input: 'https://curitipao.conexus.press/festival/qualquer-coisa', expStatus: 404, expLocation: null }
];

console.log('\n--- EXECUTING SUBDOMAIN TEST SCENARIOS ---');
let allPassed = true;

testCases.forEach((tc, idx) => {
  const res = evaluateSubdomainUrl(tc.input);
  const statusOk = res.status === tc.expStatus;
  const locationOk = res.location === tc.expLocation;
  const pass = statusOk && locationOk;

  if (!pass) allPassed = false;

  console.log(`[Test ${idx + 1}] ${tc.input}`);
  console.log(`       Result: HTTP ${res.status} -> ${res.location || 'NONE'}`);
  console.log(`       Expect: HTTP ${tc.expStatus} -> ${tc.expLocation || 'NONE'}`);
  console.log(`       Status: ${pass ? 'PASS' : 'FAIL'} (Rule: ${res.matchedPattern})\n`);
});

// 2. Check Physical Existence of All Mapped Assets
console.log('--- VERIFYING PHYSICAL ASSET DESTINATIONS ---');
const assetsToVerify = [
  'photos/curitipao-111.jpg',
  'photos/aquarius-cortado.webp',
  'photos/bonin-cortado.webp',
  'photos/familia-farinha-cortado.webp',
  'photos/requinte-cortado.webp',
  'photos/curitipao-108 (1).webp',
  'photos/curitipao-111.webp',
  'photos/Ciabatta recheado - Marcolini 3.webp',
  'photos/Babka de Nutella e Pistache - FELIPANE 2.webp',
  'logos/curitipao-logo.png',
  'logos/conexus-logo-oficial.png',
  'logos/conexus-logo-oficial.webp',
  'press/ric-noticias-manha-frame.jpg',
  'press/ric-noticias-manha-video.mp4',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'apple-touch-icon.png'
];

let assetsOk = true;
assetsToVerify.forEach(rel => {
  const full = path.resolve('assets', rel);
  const exists = fs.existsSync(full);
  if (!exists) {
    console.error(`[FAIL] Asset missing in curitipao/assets/: ${rel}`);
    assetsOk = false;
  } else {
    console.log(`[Asset OK] ${rel} (${fs.statSync(full).size} bytes)`);
  }
});

if (!allPassed || !assetsOk) {
  console.error('\nTest Suite FAILED!');
  process.exit(1);
}

console.log('\n========================================================');
console.log('ALL MIGRATION REWRITE TESTS PASSED WITH 100% SUCCESS!');
console.log('Explicit mappings verified, no unknown route catch-all leaks.');
console.log('========================================================\n');
