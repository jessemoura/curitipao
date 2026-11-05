const fs = require('node:fs');
const path = require('node:path');
const markdown = require('markdown-it')({ html: false });
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

function writeBlogArticles(wrapPage) {
  for (const article of articles) {
    const title = escapeHtml(article.title);
    const image = site + coverPath(article);
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
          <p>Por <strong>CuritiPão</strong></p>
        </div>
      </section>
      <section class="section">
        <div class="container roteiro-article-container">
          <article class="blog-article-body">
            <figure class="roteiro-bakery-figure">
              <img class="roteiro-bakery-img" src="${coverPath(article)}" alt="${escapeHtml(article.image_alt)}" width="${article.image_width}" height="${article.image_height}" fetchpriority="high">
              <figcaption class="roteiro-bakery-caption">
                <em>${escapeHtml(article.image_credit)}</em>
                <span>${escapeHtml(article.image_caption)}</span>
              </figcaption>
            </figure>
            ${renderBody(article)}
            <nav aria-label="Artigos relacionados">
              <h2>Leia também</h2>
              <ul>${related}</ul>
            </nav>
          </article>
        </div>
      </section>`;
    const html = wrapPage({
      title: escapeHtml(article.seo_title),
      description: escapeHtml(article.meta_description),
      canonical: article.slug_suggested,
      activeRoute: '/blog/',
      ogType: 'article',
      ogImage: image,
      content,
      schemaJson: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        description: article.meta_description,
        image,
        author: { '@type': 'Organization', name: 'CuritiPão', url: site },
        publisher: { '@type': 'Organization', name: 'CuritiPão', url: site },
        mainEntityOfPage: site + article.slug_suggested
      }
    });
    const output = path.resolve('.' + article.slug_suggested, 'index.html');
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, html.replace(/[ \t]+$/gm, ''), 'utf8');
  }
  console.log(`Generated ${articles.length} blog articles.`);
}

module.exports = { renderBlogCards, writeBlogArticles, blogUrls, invitation, invitationArticle };
