module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "sm": "600px",
        "md": "740px",
        "lg": "960px",
        "xl": "1024px",
        "2xl": "1280px",
      },
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
