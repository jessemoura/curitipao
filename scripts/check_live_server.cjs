const http = require('http');

const urls = ['/', '/festival/', '/festival/2026/'];

urls.forEach(u => {
  http.get('http://localhost:5173' + u, res => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      console.log('=== URL:', u, 'Status:', res.statusCode);
      console.log('Data length:', data.length);
      console.log('Includes "imprensa":', data.includes('imprensa'));
      console.log('Includes "Ver repercussão na imprensa":', data.includes('Ver repercussão na imprensa'));
      if (u === '/festival/2026/') {
        console.log('Includes id="imprensa":', data.includes('id="imprensa"'));
        console.log('Includes id="galeria-2026":', data.includes('id="galeria-2026"'));
        console.log('Includes class="press-card":', data.includes('class="press-card"'));
        console.log('Includes "RIC":', data.includes('RIC'));
      }
    });
  }).on('error', err => {
    console.error('Error fetching', u, err.message);
  });
});
