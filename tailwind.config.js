/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        body: ['var(--font-nunito)', 'sans-serif']
      },
      colors: {
        sage: {
          50: '#f3f6f2', 100: '#e3ebe0', 200: '#c8d8c2', 300: '#a4bd9a',
          400: '#7d9d70', 500: '#5f8151', 600: '#4a663f', 700: '#3c5234',
          800: '#32432c', 900: '#2a3826'
        },
        amber: {
          50: '#fdf8ee', 100: '#faeccc', 200: '#f4d795', 300: '#edbb5c',
          400: '#e69f33', 500: '#d9841c', 600: '#b56515', 700: '#8f4c15',
          800: '#743d17', 900: '#603317'
        }
      }
    }
  },
  plugins: []
};
