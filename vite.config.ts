import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/

export default defineConfig({
  base: '/quiz_ox/',
  build: {
    outDir: 'docs',
  },
  plugins: [react()],
})