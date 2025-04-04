module.exports = {
  content: ["./src/**/*.{html,js,jsx}"], // ✅ Vérifie que tous tes fichiers sont inclus
  theme: {
    fontFamily: {
      Roboto: ["Roboto", "sans-serif"],
      Poppins: ["Poppins", "sans-serif"],
    },
    extend: {
      screens: {
        "1000px": "1050px",
        "1100px": "1110px",
        "800px": "800px",
        "1300px": "1300px",
        "400px": "400px",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")], // ✅ OK
};
