/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      fontSize: {
        brand__font__size__xs: "12px",
        brand__font__size__sm: "14px",
        brand__font__size__base: "16px",
        brand__font__size__md: "18px",
        brand__font__size__lg: "24px",
        brand__font__size__xl: "52px",
        brand__font__size__2xl: "74px",
        section__title__size: "32px",
      },
      fontFamily: {
        brand__font__family: "Poppins",
      },
      fontWeight: {
        brand__font__thin: "100",
        brand__font__light: "300",
        brand__font__regular: "400",
        brand__font__500: "500",
        brand__font__600: "600",
        brand__font__semibold: "700",
        brand__font__bold: "900",
      },
      screens: {
        xs: "300px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      colors: {
        primary: "#171717",
        secondary: "#212121",
        text__primary: "#031401",
        text__gray: "#d1d1d1",
        text__link: "#1976d2",
        text__error: "#DC2626",
        text__success: "#22bb33",
        body__background: "#F1F4F8",
        brand__gray: "#ECECEC",
        brand__hover__gray: "#ECECEC",
      },
      padding: {
        content__padding: "0 10px",
      },
      keyframes: {},
      animation: {},
      backgroundImage: {},
    },
  },
  plugins: [require("tailwindcss-animate")],
};
