const fs = require('fs');
const path = require('path');
const { panetoneBody, bagueteBody, pumpernickelBody } = require('./prepare_three_historias.cjs');

const articlesPath = path.resolve(__dirname, '../content/blog/articles.json');
let articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

// 1. Desduplicar links da série no shokupan
const shokupan = articles.find(a => a.slug_suggested === '/blog/shokupan-pao-japones/');
if (shokupan) {
  shokupan.related_articles = [
    {
      title: "Pão para sanduíche: como escolher o formato ideal",
      url: "/blog/pao-para-sanduiche-como-escolher/"
    },
    {
      title: "Pão de fermentação natural: entenda o termo antes de escolher",
      url: "/blog/pao-fermentacao-natural-o-que-e/"
    },
    {
      title: "30 padarias em Curitiba para conhecer, bairro por bairro",
      url: "/roteiros/guia-padarias-curitiba-por-bairro/"
    }
  ];
}

// 2. Filtrar caso já existam para evitar duplicações
const newSlugs = new Set([
  '/blog/origem-do-panetone/',
  '/blog/historia-da-baguete-francesa/',
  '/blog/pumpernickel-pao-alemao/'
]);

articles = articles.filter(a => !newSlugs.has(a.slug_suggested));

const panetoneArticle = {
  title: "Qual é a origem do panetone? História, tradição e lendas",
  seo_title: "Origem do panetone: história e tradição | CuritiPão",
  slug_suggested: "/blog/origem-do-panetone/",
  category: "Histórias do pão",
  series: "Histórias do pão",
  meta_description: "Conheça a origem do panetone em Milão, as lendas sobre sua criação e as mudanças no preparo que fizeram desse pão uma tradição de Natal.",
  author: "Curadoria CuritiPão",
  datePublished: "2026-11-25",
  dateModified: "2026-11-25",
  image: "historias-do-pao/historia-do-panetone.jpg",
  share_image: "historias-do-pao/historia-do-panetone.jpg",
  share_width: 1200,
  share_height: 675,
  share_type: "image/jpeg",
  image_alt: "Panetone com uvas-passas e frutas cristalizadas, acompanhado de uma fatia sobre uma mesa de madeira.",
  image_caption: "Imagem ilustrativa",
  image_credit: "",
  image_width: 1200,
  image_height: 675,
  body_markdown: panetoneBody,
  related_articles: [
    {
      title: "Pães doces para o café: uma escolha para cada encontro",
      url: "/blog/paes-doces-para-cafe/"
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

const bagueteArticle = {
  title: "Baguete francesa: a história do pão que virou símbolo da França",
  seo_title: "Baguete francesa: história e tradição | CuritiPão",
  slug_suggested: "/blog/historia-da-baguete-francesa/",
  category: "Histórias do pão",
  series: "Histórias do pão",
  meta_description: "Conheça a história da baguete francesa, os saberes reconhecidos pela UNESCO e o trabalho por trás de seus ingredientes, formato e crosta.",
  author: "Curadoria CuritiPão",
  datePublished: "2026-11-25",
  dateModified: "2026-11-25",
  image: "historias-do-pao/historia-da-baguete-francesa.jpg",
  share_image: "historias-do-pao/historia-da-baguete-francesa.jpg",
  share_width: 1200,
  share_height: 675,
  share_type: "image/jpeg",
  image_alt: "Baguetes de crosta dourada e cortes diagonais, com um pedaço aberto mostrando o miolo.",
  image_caption: "Imagem ilustrativa",
  image_credit: "",
  image_width: 1200,
  image_height: 675,
  body_markdown: bagueteBody,
  related_articles: [
    {
      title: "Por que o padeiro faz cortes na massa do pão?",
      url: "/blog/por-que-fazer-cortes-na-massa-do-pao/"
    },
    {
      title: "O que perguntar antes de comprar um pão artesanal",
      url: "/blog/comprar-pao-artesanal-perguntas/"
    },
    {
      title: "30 padarias em Curitiba para conhecer, bairro por bairro",
      url: "/roteiros/guia-padarias-curitiba-por-bairro/"
    }
  ]
};

const pumpernickelArticle = {
  title: "Pumpernickel: conheça o pão alemão de preparo prolongado",
  seo_title: "Pumpernickel: conheça o pão alemão de centeio | CuritiPão",
  slug_suggested: "/blog/pumpernickel-pao-alemao/",
  category: "Histórias do pão",
  series: "Histórias do pão",
  meta_description: "Descubra o que é Pumpernickel, o pão alemão de centeio ligado à Vestfália, e como o preparo prolongado define sua textura e sabor.",
  author: "Curadoria CuritiPão",
  datePublished: "2026-11-25",
  dateModified: "2026-11-25",
  image: "historias-do-pao/pao-alemao-pumpernickel.jpg",
  share_image: "historias-do-pao/pao-alemao-pumpernickel.jpg",
  share_width: 1200,
  share_height: 675,
  share_type: "image/jpeg",
  image_alt: "Pão de centeio Pumpernickel escuro e compacto, com fatias finas sobre tecido e tábua de madeira.",
  image_caption: "Imagem ilustrativa",
  image_credit: "",
  image_width: 1200,
  image_height: 675,
  body_markdown: pumpernickelBody,
  related_articles: [
    {
      title: "Integral, multigrãos e pão com sementes: o que perguntar",
      url: "/blog/pao-integral-multigraos-diferenca/"
    },
    {
      title: "Casca e miolo: um jeito de observar os pães sem buscar um padrão único",
      url: "/blog/casca-miolo-alveolos-pao/"
    },
    {
      title: "30 padarias em Curitiba para conhecer, bairro por bairro",
      url: "/roteiros/guia-padarias-curitiba-por-bairro/"
    }
  ]
};

// Inserir os 3 novos artigos no início do array
articles.unshift(panetoneArticle, bagueteArticle, pumpernickelArticle);

fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2), 'utf8');
console.log(`Sucesso: ${articles.length} artigos agora em articles.json.`);
