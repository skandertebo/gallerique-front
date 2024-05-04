/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "login-bg": "url('/src/assets/images/bg-login.png')",
      },
      fontFamily: {
        serif: ["Laila", "serif"],
        custom: ["Laila", "seif"],
      },
      colors: {
        "palette-1": "#6f725a",
        "palette-2": "#9b9b7a",
        "palette-3": "#cf9977",
        "palette-4": "#f4e3b8",
        "palette-5": "#ad6434",
        "palette-6": "#876c5a",
      },
    },
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
  },
  plugins: [],
};
