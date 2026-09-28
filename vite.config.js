import { defineConfig } from 'vite';

// Cloudflare Pages' Vite setup expects a plugins array, even for a static app.
export default defineConfig({
  base: './',
  plugins: []
});

