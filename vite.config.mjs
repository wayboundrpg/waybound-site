import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),   // ← the Vite plugin for Tailwind v4
  ],
  root: '.',
  build: {
    outDir: 'dist',
  },
})
