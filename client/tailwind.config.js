/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'y2k-pink': '#ffcaf2',
        'y2k-blue': '#a2edff',
        'y2k-green': '#bcffbc',
        'y2k-purple': '#c9b1ff',
        'y2k-yellow': '#fff3ad',
        'y2k-red': '#ffb2b1',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'y2k-bg': "url('https://64.media.tumblr.com/bcfea4a5e8ad504a317d3945a52a66cd/ef88cccc47cd17c9-77/s75x75_c1/4118951c5afbe9ebec4ba4373180fadbcb463a28.png')",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

