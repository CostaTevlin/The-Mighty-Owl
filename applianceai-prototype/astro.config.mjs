import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  integrations: [tailwind({ configFile: fileURLToPath(new URL('./tailwind.config.mjs', import.meta.url)) })],
  output: 'static',
  outDir: './dist',
  site: 'https://costatevlin.github.io',
  base: '/The-Mighty-Owl',
});
