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
        primary: "#1E40AF", // Example: Indigo 700
        secondary: "#10B981", // Example: Emerald 500
        tertiary: "#F59E0B", // Example: Amber 400
      },
    },
  },
  plugins: [],
};
