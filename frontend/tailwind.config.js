/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html"
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px'
    },
    extend: {
      fontSize: {
        'maxFont': '150px'
      },
      brightness: {
        30: '.30'
      },
      colors: {
        brightRed: 'hsl(12, 88%, 59%)',
        brightRedLight: 'hsl(12, 88%, 69%)',
        brightRedSupLight: 'hsl(12, 88%, 95%)',
        darkBlue: 'hsl(228, 39%, 23%)',
        darkGrayishBlue: 'hsl(227, 12%, 61%)',
        veryDarkBlue: 'hsl(233, 12%, 13%)',
        veryPaleRed: 'hsl(13, 100%, 96%)',
        veryLightGray: 'hsl(0, 0%, 98%)',
        customRed: 'rgb(194, 63, 46)',

        green40k: '#105C75',
        green40klight: '#b7e6f5',
        green40klighter: '#DBF2FA',
        gold40k: '#A37E2C',
        white40k: '#ffffff',
        black40k: '#272727',
        black40klight: '#707070',
        black40klighter: '#b8b8b8',
        red40k: '#8c1c13',
        red40klight: '#C5261B'
      },
      fontFamily: {
        'arial-black': ['Arial Black', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
