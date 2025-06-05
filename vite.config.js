import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'ECMAtomSpace',
      fileName: (format) => `ecmatomspace.${format}.js`
    },
    rollupOptions: {
      output: {
        globals: {
          uuid: 'uuid'
        }
      }
    }
  }
});