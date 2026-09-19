import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { copyFileSync, existsSync } from 'node:fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-static-scripts',
      closeBundle() {
        const src = resolve(__dirname, 'script1.js');
        const dest = resolve(__dirname, 'dist/script1.js');
        if (existsSync(src)) {
          copyFileSync(src, dest);
        }
        const srcCss = resolve(__dirname, 'style1.css');
        const destCss = resolve(__dirname, 'dist/style1.css');
        if (existsSync(srcCss)) {
          copyFileSync(srcCss, destCss);
        }
      },
    },
  ],
  server: {
    port: 5173,
    host: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        hospital: resolve(__dirname, 'hospital-auth.html'),
        donor: resolve(__dirname, 'donor-hub.html'),
        ngo: resolve(__dirname, 'ngo-portal.html'),
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
