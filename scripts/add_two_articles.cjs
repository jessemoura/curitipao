const fs = require('fs');
const path = require('path');
const { shokupanBody, cortesBody } = require('./two_new_articles_content.cjs');

const articlesPath = path.resolve(__dirname, '../content/blog/articles.json');
let articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

// Filter out if they already exist to avoid duplicates
articles = articles.filter(a => 
  a.slug_suggested !== '/blog/shokupan-pao-japones/' && 
  a.slug_suggested !== '/blog/por-que-fazer-cortes-na-massa-do-pao/'
);

const shokupanArticle = {
  title: "Shokupan: conheça o pão japonês de miolo macio",
  seo_title: "Shokupan: conheça o tradicional pão japonês | CuritiPão",
  slug_suggested: "/blog/shokupan-pao-japones/",
  category: "Histórias do pão",
  series: "Histórias do pão",
  meta_description: "Conheça o shokupan, o tradicional pão japonês de miolo macio e delicado, sua história, características, técnicas de preparo e formas de consumo.",
  author: "Curadoria CuritiPão",
  datePublished: "2026-11-25",
  dateModified: "2026-11-25",
  image: "historias-do-pao/shokupan.jpg",
  share_image: "historias-do-pao/shokupan.jpg",
  share_width: 1200,
  share_height: 675,
  share_type: "image/jpeg",
  image_alt: "Pão japonês shokupan com casca dourada e fatias de miolo branco e macio sobre uma tábua de madeira.",
  image_caption: "Imagem ilustrativa",
  image_credit: "",
  image_width: 1200,
  image_height: 675,
  body_markdown: shokupanBody,
  related_articles: [
    {
      title: "Como surgiu o pão? Uma história que começou antes da agricultura",
      url: "/blog/como-surgiu-o-pao/"
    },
    {
      title: "Pão de fermentação natural: entenda o termo antes de escolher",
      url: "/blog/pao-fermentacao-natural-o-que-e/"
    },
    {
      title: "30 padarias em Curitiba para conhecer, bairro por bairro",
      url: "/roteiros/guia-padarias-curitiba-por-bairro/"
    }
  ]
};

const cortesArticle = {
  title: "Por que o padeiro faz cortes na massa do pão?",
  seo_title: "Por que o padeiro faz cortes na massa do pão? | CuritiPão",
  slug_suggested: "/blog/por-que-fazer-cortes-na-massa-do-pao/",
  category: "Pães e sabores",
  meta_description: "Descubra por que os padeiros fazem cortes na massa antes de assar e como essa técnica influencia a expansão, a crosta e a aparência dos pães artesanais.",
  author: "Curadoria CuritiPão",
  datePublished: "2026-11-25",
  dateModified: "2026-11-25",
  image: "cortes-no-pao.webp",
  share_image: "cortes-no-pao-share.jpg",
  share_width: 1200,
  share_height: 630,
  share_type: "image/jpeg",
  image_alt: "Massa de pão artesanal com corte longitudinal ao lado de um pão assado com crosta dourada e uma lâmina de padeiro.",
  image_caption: "Imagem ilustrativa",
  image_credit: "",
  image_width: 1200,
  image_height: 675,
  body_markdown: cortesBody,
  related_articles: [
    {
      title: "Casca e miolo: um jeito de observar os pães sem buscar um padrão único",
      url: "/blog/casca-miolo-alveolos-pao/"
    },
    {
      title: "Pão de fermentação natural: entenda o termo antes de escolher",
      url: "/blog/pao-fermentacao-natural-o-que-e/"
    },
    {
      title: "Onde comer croissant em Curitiba: 10 endereços para conhecer",
      url: "/roteiros/onde-comer-croissant-em-curitiba/"
    }
  ]
};

// Insert at the beginning: shokupan first, then cortes
articles.unshift(shokupanArticle, cortesArticle);

fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2), 'utf8');
console.log(`Successfully added 2 articles. Total articles in articles.json: ${articles.length}`);
