import { defineConfig } from 'vite';

export default defineConfig({
  base: '/happy-nerds/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
});
