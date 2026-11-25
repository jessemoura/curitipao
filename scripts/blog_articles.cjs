const fs = require('node:fs');
const path = require('node:path');
const markdown = require('markdown-it')({ html: false, linkify: true });
const articles = require('../content/blog/articles.json');

const site = 'https://curitipao.com.br';
const invitationArticle = '/blog/indicar-cadastrar-padaria-curitipao/';
const invitationLabel = 'Apresente sua padaria ao CuritiPão';
const htmlEntities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => htmlEntities[char]);
const coverPath = article => '/assets/photos/blog/' + article.image;
const blogUrls = articles.map(article => site + article.slug_suggested);

function invitation(href, copy) {
  return `<aside class="roteiro-how-to-use blog-invitation">
    <p>${escapeHtml(copy)}</p>
    <a class="btn btn-primary" href="${href}">${invitationLabel}</a>
  </aside>`;
}

function renderBlogCards() {
  return articles.map(article => `
    <article class="card-editorial blog-card" data-title="${escapeHtml(article.title)}" data-summary="${escapeHtml(article.meta_description)}" data-category="${escapeHtml(article.category)}">
      <div class="card-media"><img src="${coverPath(article)}" alt="${escapeHtml(article.image_alt)}" width="${article.image_width}" height="${article.image_height}" loading="lazy"></div>
      <div class="card-body">
        <span class="card-tag">${escapeHtml(article.category)}</span>
        <h3 class="card-title"><a href="${article.slug_suggested}">${escapeHtml(article.title)}</a></h3>
        <p class="card-desc">${escapeHtml(article.meta_description)}</p>
        <div class="card-footer"><a href="${article.slug_suggested}" class="btn btn-secondary" aria-label="${escapeHtml('Ler artigo: ' + article.title)}">Ler artigo &rarr;</a></div>
      </div>
    </article>`).join('\n');
}

function renderBody(article) {
  const [intro, ...sections] = article.body_markdown.split(/(?=^## )/m);
  const callout = article.slug_suggested === invitationArticle
    ? invitation('/contato/', 'Você tem uma padaria em Curitiba? Conte à nossa equipe a história da sua casa e quais são as suas especialidades.')
    : '';
  return markdown.render(intro) + callout + markdown.render(sections.join(''));
}

function renderSeriesNav(article) {
  if (article.series !== 'Histórias do pão') return '';
  const seriesArticles = [
    { slug: '/blog/como-surgiu-o-pao/', title: 'Como surgiu o pão? Uma história que começou antes da agricultura' },
    { slug: '/blog/pao-islandia-calor-da-terra/', title: 'O pão que assa debaixo da terra: conheça uma tradição da Islândia' },
    { slug: '/blog/lavash-pao-tradicional-armenia/', title: 'Lavash: o pão fininho que carrega uma tradição da Armênia' },
    { slug: '/blog/shokupan-pao-japones/', title: 'Shokupan: conheça o pão japonês de miolo macio' },
    { slug: '/blog/origem-do-panetone/', title: 'Qual é a origem do panetone? História, tradição e lendas' },
    { slug: '/blog/historia-da-baguete-francesa/', title: 'Baguete francesa: a história do pão que virou símbolo da França' },
    { slug: '/blog/pumpernickel-pao-alemao/', title: 'Pumpernickel: conheça o pão alemão de preparo prolongado' }
  ];
  const items = seriesArticles
    .filter(item => item.slug !== article.slug_suggested)
    .map(item => `<li><a href="${item.slug}"><strong>${escapeHtml(item.title)}</strong></a></li>`)
    .join('');

  return `
    <nav class="series-nav" aria-label="Série Histórias do pão" style="margin: 36px 0; padding: 24px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md);">
      <span class="badge badge-gold" style="margin-bottom: 8px; display: inline-block;">Série editorial</span>
      <h2 style="font-size: 1.25rem; margin: 4px 0 12px; color: var(--color-text);">Continue na série Histórias do pão</h2>
      <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
        ${items}
      </ul>
    </nav>`;
}

function writeBlogArticles(wrapPage) {
  for (const article of articles) {
    const title = escapeHtml(article.title);
    const coverUrl = site + coverPath(article);
    const ogImage = article.share_image ? site + '/assets/photos/blog/' + article.share_image : coverUrl;
    const authorName = article.author || 'Curadoria CuritiPão';
    const related = article.related_articles.map(link =>
      `<li><a href="${escapeHtml(link.url)}">${escapeHtml(link.title)}</a></li>`
    ).join('');
    const content = `
      <section class="page-intro-header">
        <div class="container roteiro-article-container">
          <nav class="breadcrumbs" aria-label="Trilha de navegação">
            <a href="/">Início</a><span class="sep">/</span>
            <a href="/blog/">Blog</a><span class="sep">/</span>
            <span aria-current="page">${escapeHtml(article.category)}</span>
          </nav>
          <span class="badge badge-gold">${escapeHtml(article.category)}</span>
          <h1>${title}</h1>
          <p class="article-byline">Por <strong>${escapeHtml(authorName)}</strong></p>
        </div>
      </section>
      <section class="section">
        <div class="container roteiro-article-container">
          <article class="blog-article-body">
            <figure class="roteiro-bakery-figure">
              <img class="roteiro-bakery-img" src="${coverPath(article)}" alt="${escapeHtml(article.image_alt)}" width="${article.image_width}" height="${article.image_height}" fetchpriority="high">
              <figcaption class="roteiro-bakery-caption">
                ${article.image_credit ? `<em>${escapeHtml(article.image_credit)}</em>` : ''}
                <span>${escapeHtml(article.image_caption)}</span>
              </figcaption>
            </figure>
            ${renderBody(article)}
            ${renderSeriesNav(article)}
            <nav aria-label="Artigos relacionados">
              <h2>Leia também</h2>
              <ul>${related}</ul>
            </nav>
          </article>
        </div>
      </section>`;

    const extraHead = `
  <meta property="og:image:width" content="${article.share_width || 1200}">
  <meta property="og:image:height" content="${article.share_height || (article.share_image ? 630 : 675)}">
  <meta property="og:image:type" content="${article.share_type || (article.share_image ? 'image/jpeg' : 'image/webp')}">
  <meta property="og:image:alt" content="${escapeHtml(article.image_alt)}">
  <meta name="twitter:image:alt" content="${escapeHtml(article.image_alt)}">`;

    const schemaJson = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Início', 'item': site + '/' },
            { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': site + '/blog/' },
            { '@type': 'ListItem', 'position': 3, 'name': article.category, 'item': site + '/blog/' },
            { '@type': 'ListItem', 'position': 4, 'name': article.title, 'item': site + article.slug_suggested }
          ]
        },
        {
          '@type': 'BlogPosting',
          'headline': article.title,
          'description': article.meta_description,
          'image': ogImage,
          'datePublished': article.datePublished || '2026-11-04',
          'dateModified': article.dateModified || '2026-11-25',
          'author': { '@type': 'Organization', 'name': authorName, 'url': site },
          'publisher': {
            '@type': 'Organization',
            'name': 'CuritiPão',
            'url': site,
            'logo': {
              '@type': 'ImageObject',
              'url': site + '/assets/curitipao-logo.png'
            }
          },
          'mainEntityOfPage': site + article.slug_suggested
        }
      ]
    };

    const html = wrapPage({
      title: escapeHtml(article.seo_title),
      description: escapeHtml(article.meta_description),
      canonical: article.slug_suggested,
      activeRoute: '/blog/',
      ogType: 'article',
      ogImage,
      content,
      extraHead,
      schemaJson
    });
    const output = path.resolve('.' + article.slug_suggested, 'index.html');
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, html.replace(/[ \t]+$/gm, ''), 'utf8');
  }
  console.log(`Generated ${articles.length} blog articles.`);
}

module.exports = { renderBlogCards, writeBlogArticles, blogUrls, invitation, invitationArticle };
