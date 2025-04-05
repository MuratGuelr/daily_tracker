/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Projenizdeki dosya yollarına göre ayarlayın
  ],
  darkMode: "class", // 'media' yerine 'class' kullanacağız
  theme: {
    extend: {},
  },
  plugins: [],
};
