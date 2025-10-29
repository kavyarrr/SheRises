/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          lavender: '#C7C5F4',
          pink: '#F8C8DC',
          beige: '#F3E9DC',
          mint: '#D6F5E5',
          sky: '#D7E8FF'
        }
      },
      boxShadow: {
        soft: '0 10px 25px rgba(0,0,0,0.06)'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem'
      }
    },
  },
  plugins: [],
}


