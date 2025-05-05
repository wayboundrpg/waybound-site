// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // Serve index.html & tools/… from project root
  root: '.',
  // Static files (JSON, scripts under public/) remain in `public/`
  publicDir: 'public',
  // When `npm run dev` starts, open the real index.html
  server: {
    open: '/index.html'
  },
  build: {
    // Output bundled HTML/JS/CSS to dist/
    outDir: 'dist',
    emptyOutDir: true
  }
});
