
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#F8F4E9',
        'secondary': '#F94A13'
      },
      fontFamily: {
        custom: ['Roboto', 'sans-serif'],
        myfont: ['Agu Display', 'serif'],
        myfont2:["Sour Gummy", "sans-serif"]
      },
   


    },
  },
        plugins: [],
}