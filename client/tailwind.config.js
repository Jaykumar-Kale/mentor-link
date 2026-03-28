/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mudita: {
          amber:  '#f59e0b',
          indigo: '#3730a3',
          purple: '#6b21a8',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter:   ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
