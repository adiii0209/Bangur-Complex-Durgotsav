/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        puja: {
          red: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            500: '#b91c1c',
            600: '#991b1b',
            700: '#8b0000',
            800: '#700909',
            900: '#520606',
            DEFAULT: '#8b0000',
          },
          gold: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#d4af37',
            600: '#b8860b',
            700: '#926b08',
            DEFAULT: '#d4af37',
          },
          cream: {
            50: '#fffefc',
            100: '#fffdf7',
            200: '#fefae0',
            DEFAULT: '#fffdf7',
          },
          green: {
            500: '#15803d',
            600: '#166534',
            700: '#14532d',
            DEFAULT: '#166534',
          },
          dark: {
            light: '#231515',
            DEFAULT: '#140b0b',
            deep: '#0a0505',
          }
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
      }
    },
  },
  plugins: [],
}
