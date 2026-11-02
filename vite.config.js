import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    open: false,
    host: true
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        sobre: resolve(import.meta.dirname, 'sobre/index.html'),
        padarias: resolve(import.meta.dirname, 'padarias/index.html'),
        padariasModelo: resolve(import.meta.dirname, 'padarias/modelo/index.html'),
        roteiros: resolve(import.meta.dirname, 'roteiros/index.html'),
        roteirosModelo: resolve(import.meta.dirname, 'roteiros/modelo/index.html'),
        blog: resolve(import.meta.dirname, 'blog/index.html'),
        blogArtigo: resolve(import.meta.dirname, 'blog/o-curitipao-continua/index.html'),
        festival: resolve(import.meta.dirname, 'festival/index.html'),
        festival2026: resolve(import.meta.dirname, 'festival/2026/index.html'),
        contato: resolve(import.meta.dirname, 'contato/index.html'),
        solucoesDigitais: resolve(import.meta.dirname, 'solucoes-digitais/index.html'),
        privacidade: resolve(import.meta.dirname, 'privacidade/index.html'),
        notFound: resolve(import.meta.dirname, '404.html')
      }
    }
  }
});
