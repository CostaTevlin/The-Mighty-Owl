import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  outDir: './dist',
  site: 'https://costatevlin.github.io',
  base: '/The-Mighty-Owl',
});
