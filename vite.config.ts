import { defineConfig } from 'vite';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
    copyPublicDir: false,
  },
  publicDir: 'public',
  plugins: [
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/manifest.json',
          dest: '.',
        },
        {
          src: 'public/font/**/*',
          dest: 'font/',
        },
        {
          src: 'public/imgs/neutrabize-128.png',
          dest: 'imgs/',
        },
        {
          src: 'public/imgs/bg/exoplanets.jpeg',
          dest: 'imgs/bg/',
        },
        {
          src: 'public/imgs/icons/**/*',
          dest: 'imgs/icons/',
        },
        {
          src: 'public/imgs/thumbnails/**/*',
          dest: 'imgs/thumbnails/',
        },
        {
          src: 'public/imgs/textures/**/*',
          dest: 'imgs/textures/',
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
