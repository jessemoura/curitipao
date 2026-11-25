const fs = require('fs');
const m = JSON.parse(fs.readFileSync('curitipao-20-artigos/manifesto.json', 'utf8'));

function parseInline(text) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*([^*]|$)/g, '$1<em>$2</em>$3')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
      const isExternal = url.startsWith('http') && !url.includes('curitipao.com.br');
      const targetRel = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${url}"${targetRel}>${linkText}</a>`;
    });
}

function markdownToHtml(md) {
  let cleanMd = md.replace(/^#\s+[^\n]+\n+/, '');
  const blocks = cleanMd.split(/\n\s*\n/);
  const htmlBlocks = [];
  for (let block of blocks) {
    block = block.trim();
    if (!block) continue;
    if (block.startsWith('## ')) {
      htmlBlocks.push('<h2>' + parseInline(block.replace(/^##\s+/, '')) + '</h2>');
      continue;
    }
    if (block.startsWith('### ')) {
      htmlBlocks.push('<h3>' + parseInline(block.replace(/^###\s+/, '')) + '</h3>');
      continue;
    }
    if (/^[\-\*]\s+/m.test(block)) {
      const items = block.split('\n').filter(l => l.trim().startsWith('- ') || l.trim().startsWith('* '));
      const lis = items.map(item => '  <li>' + parseInline(item.replace(/^[\-\*]\s+/, '')) + '</li>').join('\n');
      htmlBlocks.push('<ul>\n' + lis + '\n</ul>');
      continue;
    }
    if (/^\d+\.\s+/m.test(block)) {
      const items = block.split('\n').filter(l => /^\d+\.\s+/.test(l.trim()));
      const lis = items.map(item => '  <li>' + parseInline(item.replace(/^\d+\.\s+/, '')) + '</li>').join('\n');
      htmlBlocks.push('<ol>\n' + lis + '\n</ol>');
      continue;
    }
    htmlBlocks.push('<p>' + parseInline(block) + '</p>');
  }
  return htmlBlocks.join('\n');
}

let totalBlocks = 0;
m.articles.forEach(a => {
  const html = markdownToHtml(a.body_markdown);
  const pCount = (html.match(/<p>/g) || []).length;
  const h2Count = (html.match(/<h2>/g) || []).length;
  const h3Count = (html.match(/<h3>/g) || []).length;
  const ulCount = (html.match(/<ul>/g) || []).length;
  const olCount = (html.match(/<ol>/g) || []).length;
  totalBlocks += pCount + h2Count + h3Count + ulCount + olCount;
  console.log(a.id, a.slug_suggested, 'P:', pCount, 'H2:', h2Count, 'H3:', h3Count, 'UL:', ulCount, 'OL:', olCount);
});
console.log('Total converted blocks across 20 articles:', totalBlocks);
