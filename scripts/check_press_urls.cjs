const https = require('https');
const http = require('http');

const urls = [
  { name: 'TopView', url: 'https://topview.com.br/grands/1-curitipao-reune-15-padarias-de-curitiba-com-receitas-exclusivas-festival-quer-mostrar-a-diversidade-da-panificacao-curitibana/' },
  { name: 'CBN Curitiba', url: 'https://cbncuritiba.com.br/materias/festival-curitipao-vai-ate-sexta-30-em-15-padarias-de-curitiba-ouca-a-coluna/' },
  { name: 'Bem Paraná — Comer e Curtir 1', url: 'https://www.bemparana.com.br/publicacao/blogs/comerecurtir/festival-curitipao-reune-criacoes-exclusivas-em-15-padarias-de-curitiba/' },
  { name: 'Bem Paraná — Comer e Curtir 2', url: 'https://www.bemparana.com.br/publicacao/blogs/comerecurtir/festival-curitipao-reune-criacoes-exclusivas-em-15-padarias-ate-sexta-feira/' },
  { name: 'Bem Paraná — Mesa Dividida 1', url: 'https://www.bemparana.com.br/publicacao/blogs/mesadividida/curitiba-celebra-a-arte-de-fazer-pao-com-o-festival-curitipao/' },
  { name: 'Bem Paraná — Mesa Dividida 2', url: 'https://www.bemparana.com.br/publicacao/blogs/mesadividida/curitiba-celebra-a-panificacao-autoral/' },
  { name: 'Folha de Curitiba', url: 'https://folhadecuritiba.com.br/festival-curitipao-comeca-nesta-terca-com-criacoes-exclusivas-em-15-padarias-de-curitiba/' },
  { name: 'Curitiba Honesta', url: 'https://curitibahonesta.com.br/festival-curitipao-entra-na-reta-final-com-criacoes-exclusivas-em-15-padarias-de-curitiba/' },
  { name: 'Sabores de Curitiba', url: 'https://saboresdecuritiba.com.br/festival-curitipao-reune-15-padarias-de-curitiba-com-receitas-exclusivas/' },
  { name: 'Paranashop', url: 'https://www.paranashop.com.br/post/eventos-curitiba-parana-agenda-da-semana' }
];

async function checkUrl(item) {
  try {
    const res = await fetch(item.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
      },
      redirect: 'follow'
    });

    if (!res.ok) {
      return { name: item.name, url: item.url, status: res.status, error: 'HTTP Status ' + res.status };
    }

    const html = await res.text();
    
    // Title
    const ogTitle = html.match(/<meta property=["']og:title["'] content=["'](.*?)["']/i);
    const titleTag = html.match(/<title>(.*?)<\/title>/i);
    const h1Tag = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);

    // Date
    const dateMatch = html.match(/<meta property=["']article:published_time["'] content=["'](.*?)["']/i) ||
                      html.match(/<time[^>]*datetime=["'](.*?)["']/i) ||
                      html.match(/"datePublished":\s*"([^"]+)"/i) ||
                      html.match(/\b(\d{1,2}\s+de\s+[a-zç]+\s+de\s+\d{4})\b/i) ||
                      html.match(/\b(\d{1,2}\/\d{1,2}\/\d{4})\b/);

    // Audio
    const hasAudio = html.includes('<audio') || html.includes('podcast') || html.includes('spotify') || html.includes('.mp3') || html.includes('soundcloud');

    // Clean h1
    const cleanH1 = h1Tag ? h1Tag[1].replace(/<[^>]+>/g, '').trim() : '';

    return {
      name: item.name,
      url: item.url,
      status: res.status,
      title: ogTitle ? ogTitle[1] : (cleanH1 || (titleTag ? titleTag[1] : '')),
      date: dateMatch ? (dateMatch[1] || dateMatch[0]) : null,
      hasAudio: hasAudio,
      bodySnippet: html.slice(0, 500)
    };
  } catch (err) {
    return { name: item.name, url: item.url, status: 0, error: err.message };
  }
}

async function run() {
  console.log('Testing URLs...');
  for (const item of urls) {
    const result = await checkUrl(item);
    console.log('----------------------------------------------------');
    console.log('Source:', result.name);
    console.log('Status:', result.status, result.error || 'OK');
    if (result.title) console.log('Title:', result.title);
    if (result.date) console.log('Date:', result.date);
    if (result.hasAudio) console.log('Has Audio:', result.hasAudio);
  }
}

run();
