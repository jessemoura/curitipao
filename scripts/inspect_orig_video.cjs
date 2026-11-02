const fs = require('fs');
const orig = fs.readFileSync('../curitipao-2026/index.html', 'utf8');
const m = orig.match(/<section class="video-section"[^>]*>[\s\S]*?<\/section>/);
if (m) {
  console.log('Original Video Section:');
  console.log(m[0]);
} else {
  console.log('No video section in original index.html');
}
