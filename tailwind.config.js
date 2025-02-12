/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}', './index.html'],
  theme: {
    extend: {
      keyframes: {
        'get-in': {
          from: {
            opacity: 0,
            transform: 'translateY(500px)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0px)',
          },
        },
      },
      animation: {
        'get-in': 'get-in 600ms ease-in forwards',
      },
    },
  },
  plugins: [],
};
