import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { reactNodeTransform, astroSourceIntegration } from './scripts/inject-source-info';

function collectRoutes(projectRoot) {
  const srcDir = path.join(projectRoot, 'src');
  const fileTypes = /\.(astro|vue|js|ts|jsx|tsx|md|mdx|html)$/i;
  const routes = new Set();
  const addByName = (name) => {
    if (!name) return;
    if (name === 'placeholder') return;
    routes.add(`${name}.html`);
  };
  const addByHtmlLink = (name) => {
    if (!name) return;
    if (name === 'placeholder') return;
    routes.add(`${name}.html`);
  };
  const REGEXES = [
    // './about.html' | '/about.html' | 'about.html?x=1' | `./about.html?id=${x}#hash`
    {
      re: /(["'`])(?:\.\/|\/)?([A-Za-z0-9_-]+)\.html(?:[?#][^"'`]*)?\1/g,
      cb: (m) => addByHtmlLink(m[2]),
    },
    // navigateTo('page_id')
    {
      re: /\bnavigateTo\s*\(\s*['"]([A-Za-z0-9_-]+)['"]\s*\)/g,
      cb: (m) => addByName(m[1]),
    },
    // setActiveNavItem('page_id')
    {
      re: /\bsetActiveNavItem\s*\(\s*['"]([A-Za-z0-9_-]+)['"]\s*\)/g,
      cb: (m) => addByName(m[1]),
    },
    // data-nav-item / data-page-id
    {
      re: /data-(?:nav-item|page-id)\s*=\s*['"]([A-Za-z0-9_-]+)['"]/g,
      cb: (m) => addByName(m[1]),
    },
  ];
  (function walk(p) {
    for (const e of fs.readdirSync(p, { withFileTypes: true })) {
      const full = path.join(p, e.name);
      if (e.isDirectory()) {
        walk(full);
      } else if (e.isFile() && fileTypes.test(e.name)) {
        const txt = fs.readFileSync(full, 'utf8');

        for (const { re, cb } of REGEXES) {
          let m;
          while ((m = re.exec(txt))) {
            cb(m);
          }
        }
      }
    }
  })(srcDir);
  return routes;
}

function redirectMissingRoutes() {
  return {
    name: 'redirect-missing-routes',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const outDir = fileURLToPath(dir);
        const projectRoot = fileURLToPath(new URL('.', import.meta.url));

        const existing = new Set();
        (function walk(p) {
          for (const e of fs.readdirSync(p, { withFileTypes: true })) {
            const full = path.join(p, e.name);
            if (e.isDirectory()) walk(full);
            else if (e.isFile() && e.name.endsWith('.html')) existing.add(e.name);
          }
        })(outDir);

        const referenced = collectRoutes(projectRoot);

        for (const name of referenced) {
          if (name === 'placeholder.html') continue;
          if (!existing.has(name)) {
            const target = path.join(outDir, name);
            const html =
`<!doctype html><meta charset="utf-8">
<script>location.replace('./placeholder.html')</script>
<noscript><meta http-equiv="refresh" content="0; url=./placeholder.html"></noscript>`;
            fs.writeFileSync(target, html, 'utf8');
            existing.add(name);
          }
        }
      }
    }
  };
}

export default defineConfig({
  integrations: [
    react({
      babel: {
        plugins: [reactNodeTransform()]
      }
    }),
    tailwind({
      applyBaseStyles: false
    }),
    astroSourceIntegration(),
    redirectMissingRoutes()
  ],
  output: 'static',
  build: {
    concurrency: 4,
    format: 'file',
    assets: '',
    assetsPrefix: '.',
    rollupOptions: {
      maxParallelFileOps: 24,
      output: {
        manualChunks: undefined,
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash].[ext]',
        generatedCode: {
          preset: 'es2022'
        }
      }
    }
  },
  compressHTML: false,
  vite: {
    base: './',
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    build: {
      target: 'es2022',
      minify: 'esbuild',
      chunkSizeWarningLimit: 10000,
      rollupOptions: {
        maxParallelFileOps: 24,
        output: {
          entryFileNames: '[name].[hash].js',
          chunkFileNames: '[name].[hash].js',
          assetFileNames: '[name].[hash][extname]'
        }
      }
    },
    esbuild: {
      target: 'esnext',
      minifyIdentifiers: false,
      minifySyntax: true,
      minifyWhitespace: true,
      treeShaking: true,
    },
    optimizeDeps: {
      force: false
    },
  }
});

