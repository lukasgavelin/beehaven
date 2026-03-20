/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        surface: '#F7F7F7',
        'text-primary': '#111111',
        'text-secondary': '#888888',
        accent: '#C8973A',
        border: '#E8E8E8',
        error: '#D94F4F',
        success: '#4F9D69',
        warning: '#E8A838',
      },
      fontFamily: {
        light: ['Inter_300Light'],
        regular: ['Inter_400Regular'],
        medium: ['Inter_500Medium'],
      },
    },
  },
  plugins: [],
};
