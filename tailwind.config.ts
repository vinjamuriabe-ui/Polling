import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        granite: {
          50: "#f5f5f4",
          100: "#e6e4e1",
          200: "#d0cdc8",
          300: "#a8a29e",
          400: "#8a847e",
          500: "#737069",
          600: "#5c5a54",
          700: "#44403c",
          800: "#302d2a",
          900: "#1c1917",
        },
        mountain: {
          blue: "#4a7c9e",
          pine: "#2d6a4f",
          birch: "#f0e6c8",
          snow: "#f8f9fa",
          amber: "#d4a017",
          sky: "#dbeafe",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
