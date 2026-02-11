/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        parchment: { 50: '#fdf8f0', 100: '#f5ead6', 200: '#ead3ac', 300: '#ddb97e', 400: '#cc9a52', 500: '#b8802f', 600: '#9a6824', 700: '#7a511e', 800: '#5c3d18', 900: '#3e2a12' },
        ink: { 50: '#f5f3f0', 100: '#e0dbd4', 200: '#c2b8a9', 300: '#9e907d', 400: '#7a6c58', 500: '#5c5040', 600: '#46392f', 700: '#352a22', 800: '#241c17', 900: '#14100d' },
        blood: { 50: '#fef2f2', 100: '#fde3e3', 200: '#fbc8c8', 300: '#f7a0a0', 400: '#f06868', 500: '#e83c3c', 600: '#c42020', 700: '#9c1818', 800: '#781414', 900: '#5c1212' },
        arcane: { 50: '#f4f0ff', 100: '#e8dfff', 200: '#d1bfff', 300: '#b594ff', 400: '#9466ff', 500: '#7c3aed', 600: '#6620d1', 700: '#5018a8', 800: '#3c1280', 900: '#2a0e5c' },
        nature: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d' },
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
