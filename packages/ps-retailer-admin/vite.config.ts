import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  optimizeDeps: {
    exclude: ['js-big-decimal']
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'index.ts'),
      name: 'retailers',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@emotion/react'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    sourcemap: true,
    emptyOutDir: true
  },
  plugins: [react(), dts()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        configure: () => {}
      }
    }
  },
  resolve: {
    alias: [{ find: '~', replacement: '/src' }]
  },
  define: {
    'process.env.VITE_REACT_APP_INSTANCE': JSON.stringify(
      process.env.VITE_REACT_APP_INSTANCE
    ),
    'process.env.VITE_REACT_APP_API_SUBDOMAIN': JSON.stringify(
      process.env.VITE_REACT_APP_API_SUBDOMAIN
    )
  }
});
