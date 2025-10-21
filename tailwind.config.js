// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}', './src/app/dashboards/**/*.{html,ts,css}'],
  theme: {
    extend: {
      // Additional customizations can go here
      // Most customization is now in styles.css with @theme
    },
  },
  plugins: [],
};
