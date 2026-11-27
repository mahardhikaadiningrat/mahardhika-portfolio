import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: vercel({
    includeFiles: ['./dist/server/**/*'],
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});