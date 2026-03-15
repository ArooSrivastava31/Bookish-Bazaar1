/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
       fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      // You can extend your color palette, animations, etc. here
      colors: {
        primary: '#EF4444', // Red-500
        'primary-dark': '#DC2626', // Red-600
      }
    },
  },
  plugins: [],
}
