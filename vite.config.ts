import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
  preview: { port: 5173 },
  build: { sourcemap: true },
  base: '/core-poc/admin/',
});
