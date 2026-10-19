/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAF8F5',
          100: '#F6F2EC',
          200: '#EEE7DD',
          300: '#E4D9C9',
          400: '#D4C4AE',
          500: '#BFAF96',
        },
        olive: {
          50: '#F2F5F3',
          100: '#E2E9E3',
          200: '#C7D5C9',
          300: '#A3B9A6',
          400: '#7B9B80',
          500: '#5A7D60',
          600: '#46624B',
          700: '#384E3C',
          800: '#2F4032',
          900: '#273429',
        },
        terracotta: {
          50: '#FAF3F0',
          100: '#F4E4DE',
          200: '#EBCAC0',
          300: '#DEA798',
          400: '#CE7D68',
          500: '#B85840',
          600: '#9C432E',
          700: '#7F3625',
        },
        charcoal: {
          50: '#F6F6F6',
          100: '#E7E7E7',
          200: '#D1D1D1',
          300: '#B0B0B0',
          400: '#888888',
          500: '#6D6D6D',
          600: '#5D5D5D',
          700: '#4F4F4F',
          800: '#2A2826',
          900: '#1A1816',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -4px rgba(0, 0, 0, 0.02)',
        'editorial': '0 10px 30px -5px rgba(28, 25, 23, 0.06), 0 4px 10px -2px rgba(28, 25, 23, 0.03)',
        'lifted': '0 20px 35px -10px rgba(44, 38, 34, 0.09), 0 8px 12px -5px rgba(44, 38, 34, 0.04)',
      }
    },
  },
  plugins: [],
}
