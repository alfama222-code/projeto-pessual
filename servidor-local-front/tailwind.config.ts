import type { Config } from "tailwindcss";

const config: Config = {
  // Adicione esta linha logo aqui no topo:
  darkMode: 'class', 
  
  content: [
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // <-- Garante que esta linha tem o "src/app"
],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;