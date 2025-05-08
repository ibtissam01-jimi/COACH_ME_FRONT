import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),         // 👈 alias pour /src
      '@redux': path.resolve(__dirname, '../redux'), // 👈 alias pour ton dossier redux externe
    },
  },
  server: {
    fs: {
      allow: ['..'], // permet l'accès au dossier parent
    },
  },
});
