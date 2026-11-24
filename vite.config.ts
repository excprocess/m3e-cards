import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'm3e-cards.js',
    },
    target: 'es2022',
    minify: 'esbuild',
    sourcemap: false,
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    host: '127.0.0.1',
  },
});
