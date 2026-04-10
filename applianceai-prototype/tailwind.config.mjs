/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Otto brand palette
        'otto-amber': '#E8820C',
        'otto-amber-deep': '#B85F05',
        'otto-amber-pale': '#FEF3E6',
        'otto-amber-mid': '#F5A84A',
        'otto-teal': '#1A8A7A',
        'otto-teal-glow': '#2DDBB4',
        'otto-teal-pale': '#E6F7F4',
        'otto-red': '#FF4B4B',
        'otto-red-dark': '#EA2B2B',
        'otto-red-light': '#FFF0F0',
        'otto-bg': '#FDFAF5',
        'otto-bg-alt': '#F2EBE0',
        'otto-surface': '#FFFFFF',
        'otto-border': '#E5DDD0',
        'otto-border-heavy': '#C8BBAA',
        'otto-ink': '#1A1008',
        'otto-ink-mid': '#4A3520',
        'otto-ink-soft': '#8A6E50',
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['Geist', 'system-ui', 'sans-serif'],
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
