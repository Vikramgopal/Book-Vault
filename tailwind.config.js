/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ["Cinzel", "serif"], // Corrected to lowercase key
        lato: ["Lato", "sans-serif"],
        merriweather: ["Merriweather", "serif"],
        montserrat: ["Montserrat", "sans-serif"],
        ubuntu: ["Ubuntu", "sans-serif"],
        josefin: ["Josefin Sans", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        dmsans: ["DM Sans", "sans-serif"],
      },
      animation: {
        flip: "flip 1.5s infinite ease-in-out",
      },
      keyframes: {
        flip: {
          "0%": { transform: "rotateY(0deg)" },
          "50%": { transform: "rotateY(90deg)" },
          "100%": { transform: "rotateY(180deg)" },
        },
      },
      images: {
        // litloomlogo: "url('src/assets/Litloom.png')",
        backgroundImage: {
          "login-bg": "url('/src/assets/login-bg.jpg')",
        },
      },
      colors: {
        primary: {
          DEFAULT: "#1E3A8A", // Navy Blue
          hover: "#1E40AF",
        },
        secondary: {
          DEFAULT: "#065F46", // Deep Green
          hover: "#047857",
        },
        accent: {
          orange: "#F97316", // Bright Orange
          purple: "#A78BFA", // Pastel Purple
          pink: "#F43F5E", // Rose Pink
          // blue: " #7A68EF",
          blue: " #44318D",
          graphs: "#E98074",
          // lightPink: "#FE68B4",
          lightPink: "#D83F87",
          sidebar: "#2A1B3D",
          olive: "#A4B3B6",
        },
        neutral: {
          light: "#F3F4F6", // Light Gray
          dark: "#374151", // Dark Gray
        },
        background: {
          cream: "#FFFAF0", // Cream White
          mint: "#D1FAE5", // Soft Mint
        },
      },

      // extend: {
      //   colors: {
      //     navyBlue: "#002D62",
      //     gold: "#D4AF37",
      //     lightGray: "#E0E0E0",
      //     offWhite: "#F8F8F8",
      //     black: "#000000",
      //   },
    },
  },
  plugins: [],
};
