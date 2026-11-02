async function test() {
  try {
    const res = await fetch('http://localhost:5173/');
    const html = await res.text();
    const hasNewMenu = html.includes('Soluções digitais');
    const hasNewSignature = html.includes('conexus-signature');
    console.log('Live Server Status: 200');
    console.log('Includes Soluções digitais in nav:', hasNewMenu);
    console.log('Includes conexus-signature in footer:', hasNewSignature);

    const navMatch = html.match(/<nav class="nav-desktop"[\s\S]*?<\/nav>/);
    if (navMatch) console.log('Live Nav:\n' + navMatch[0]);

    const footerMatch = html.match(/<div class="dev-credits">[\s\S]*?<\/div>/);
    if (footerMatch) console.log('Live Footer Credit:\n' + footerMatch[0]);
  } catch (err) {
    console.error('Error fetching live server:', err.message);
  }
}
test();
