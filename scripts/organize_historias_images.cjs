const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { execSync } = require('child_process');

async function main() {
  console.log('=== ORGANIZANDO IMAGENS DE HISTORIAS DO PAO ===');

  const dir = path.resolve('assets/photos/blog/historias-do-pao');
  const backupDir = path.resolve('backups');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

  const zipPath = path.join(backupDir, 'historias-do-pao-originais.zip');

  // 1. Identificar originais para backup
  const originals = [
    'origem-do-pao.png',
    'pao-islandia.png',
    'lavash-armenia.png',
    'shokupan.png.png',
    'cortes-no-pao.png.png',
    'historia-da-baguete-francesa.png',
    'historia-do-panetone.png',
    'pao-alemao-pumpernickel.png'
  ];

  console.log('1. Criando backup ZIP dos originais...');
  // Criar ZIP usando PowerShell Compress-Archive
  const filesToZip = originals
    .map(f => path.join(dir, f))
    .filter(f => fs.existsSync(f));

  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

  const psCommand = `Compress-Archive -Path ${filesToZip.map(f => `'${f}'`).join(',')} -DestinationPath '${zipPath}' -Force`;
  execSync(`powershell -NoProfile -Command "${psCommand}"`, { stdio: 'inherit' });

  const zipStat = fs.statSync(zipPath);
  console.log(`Backup ZIP criado com sucesso: ${zipPath} (${(zipStat.size / (1024 * 1024)).toFixed(2)} MB)`);

  // 2. Gerar versões JPG otimizadas (1200x675, qualidade 85, mozjpeg)
  console.log('\n2. Gerando JPGs otimizados (1200x675)...');
  const targetJpgs = [
    { src: 'origem-do-pao.png', out: 'origem-do-pao.jpg' },
    { src: 'pao-islandia.png', out: 'pao-islandia.jpg' },
    { src: 'lavash-armenia.png', out: 'lavash-armenia.jpg' },
    { src: 'shokupan.png.png', out: 'shokupan.jpg' },
    { src: 'cortes-no-pao.png.png', out: 'cortes-no-pao.jpg' },
    { src: 'historia-da-baguete-francesa.png', out: 'historia-da-baguete-francesa.jpg' },
    { src: 'historia-do-panetone.png', out: 'historia-do-panetone.jpg' },
    { src: 'pao-alemao-pumpernickel.png', out: 'pao-alemao-pumpernickel.jpg' }
  ];

  for (const item of targetJpgs) {
    const srcPath = path.join(dir, item.src);
    const outPath = path.join(dir, item.out);
    if (!fs.existsSync(srcPath)) {
      console.warn(`Arquivo fonte não encontrado: ${srcPath}`);
      continue;
    }
    await sharp(srcPath)
      .resize(1200, 675, { fit: 'cover' })
      .jpeg({ quality: 85, mozjpeg: true, chromaSubsampling: '4:2:0' })
      .toFile(outPath);

    const s = fs.statSync(outPath);
    console.log(`  Gerado: ${item.out.padEnd(32)} (${(s.size / 1024).toFixed(1)} KB)`);
  }

  // 3. Atualizar content/blog/articles.json
  console.log('\n3. Atualizando content/blog/articles.json...');
  const articlesPath = path.resolve('content/blog/articles.json');
  const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

  const mapping = {
    'historias-do-pao/shokupan.webp': 'historias-do-pao/shokupan.jpg',
    'historias-do-pao/origem-do-pao.webp': 'historias-do-pao/origem-do-pao.jpg',
    'historias-do-pao/pao-islandia.webp': 'historias-do-pao/pao-islandia.jpg',
    'historias-do-pao/lavash-armenia.webp': 'historias-do-pao/lavash-armenia.jpg'
  };

  for (const art of articles) {
    if (mapping[art.image]) {
      const oldImg = art.image;
      const newImg = mapping[oldImg];
      art.image = newImg;
      art.share_image = newImg;
      art.share_width = 1200;
      art.share_height = 675;
      art.share_type = 'image/jpeg';
      console.log(`  Atualizado artigo: ${art.slug_suggested} -> ${newImg}`);
    }
  }

  fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2), 'utf8');

  // 4. Remover variantes antigas e originais que já estão no ZIP de assets/photos/blog/historias-do-pao/
  console.log('\n4. Removendo variantes não utilizadas da pasta historias-do-pao/...');
  const keptFiles = new Set(targetJpgs.map(t => t.out));
  const currentFiles = fs.readdirSync(dir);

  for (const file of currentFiles) {
    if (!keptFiles.has(file)) {
      const filePath = path.join(dir, file);
      fs.unlinkSync(filePath);
      console.log(`  Removido: ${file}`);
    }
  }

  // 5. Limpar dist/ se existir
  const distHistDir = path.resolve('dist/assets/photos/blog/historias-do-pao');
  if (fs.existsSync(distHistDir)) {
    for (const f of fs.readdirSync(distHistDir)) {
      if (!keptFiles.has(f)) {
        fs.unlinkSync(path.join(distHistDir, f));
      }
    }
  }

  const distFestDir = path.resolve('dist/festival/2026/assets/photos/blog/historias-do-pao');
  if (fs.existsSync(distFestDir)) {
    for (const f of fs.readdirSync(distFestDir)) {
      if (!keptFiles.has(f)) {
        fs.unlinkSync(path.join(distFestDir, f));
      }
    }
  }

  console.log('\n5. Arquivos mantidos em assets/photos/blog/historias-do-pao/:');
  fs.readdirSync(dir).forEach(f => {
    const s = fs.statSync(path.join(dir, f));
    console.log(`  - ${f.padEnd(32)} (${(s.size / 1024).toFixed(1)} KB)`);
  });

  console.log('\n=== ORGANIZACAO CONCLUIDA COM SUCESSO ===');
}

main().catch(err => {
  console.error('Erro na organização:', err);
  process.exit(1);
});
