/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Duolingo-inspired palette for The Mighty Owl
        'owl-green': '#58CC02',
        'owl-green-dark': '#46A302',
        'owl-green-light': '#D7FFB8',
        'owl-blue': '#1CB0F6',
        'owl-blue-dark': '#1899D6',
        'owl-blue-light': '#DDF4FF',
        'owl-orange': '#FF9600',
        'owl-orange-dark': '#E08600',
        'owl-red': '#FF4B4B',
        'owl-red-dark': '#EA2B2B',
        'owl-red-light': '#FFF0F0',
        'owl-purple': '#CE82FF',
        'owl-bg': '#FFFFFF',
        'owl-bg-alt': '#F7F7F7',
        'owl-surface': '#FFFFFF',
        'owl-border': '#E5E5E5',
        'owl-border-heavy': '#CDCDCD',
        'owl-text': '#3C3C3C',
        'owl-text-muted': '#777777',
        'owl-text-light': '#AFAFAF',
      },
      fontFamily: {
        nunito: ['Nunito', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};
