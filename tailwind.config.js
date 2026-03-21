/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#fef2f2',
          100: '#fde8e8',
          200: '#fbd0d0',
          300: '#f9a8a8',
          400: '#f47272',
          500: '#E74C3C',
          600: '#C0392B',
          700: '#922B21',
          800: '#7B241C',
          900: '#641E16',
        },
        dark: {
          DEFAULT: '#0D0D0D',
          50:  '#F5F0EB',
          100: '#E8E0D8',
          200: '#4A4A4A',
          300: '#2C2C2C',
          400: '#1A1A1A',
          500: '#0D0D0D',
        },
        gold: '#D4AF37',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
