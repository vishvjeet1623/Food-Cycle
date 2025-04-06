/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': '#4CAF50',
        'primary-dark': '#388E3C',
        'primary-light': '#81C784',
      }
    },
  },
  plugins: [],
};