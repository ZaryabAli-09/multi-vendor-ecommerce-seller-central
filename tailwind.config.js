/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Playfair Display", "serif"], // Or "Lora"
        body: ["Inter", "sans-serif"], // Or "Roboto"
      },
      colors: {
        primary: "#f7fafc", // Example: gray-100
        secondary: "#ffffff", // Example: white
        tertiary: "#F59E0B", // Example: Amber 400
      },
    },
  },
  plugins: [],
};
