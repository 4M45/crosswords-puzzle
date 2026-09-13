/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfbf7',
          100: '#fcf6ec',
          200: '#faedd6',
          500: '#f3dcb1',
        },
        brown: {
          800: '#5a3d2b',
          900: '#4a2b1b',
        },
        primary: '#00d2d3'
      },
      fontFamily: {
        sans: ['var(--font-nunito)', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
};
