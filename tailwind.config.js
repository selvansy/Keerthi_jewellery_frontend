/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'custom-gray': 'rgba(239, 239, 239, 0.3)',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
  // Add styles at root level
  corePlugins: {
    preflight: true,
  },
  // Add the styles directly in the CSS
  css: {
    'input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: '0',
    },
    'input[type="number"]': {
      '-moz-appearance': 'textfield',
    },
  },
}