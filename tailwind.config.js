/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B1220",
        panel: "#101826",
        line: "#1E293B",
        paper: "#F5F3EE",
        muted: "#8A93A6",
        action: "#2775CA",
        "action-dim": "#1B5A99",
        pending: "#C98A3A",
        success: "#3FB37F",
        danger: "#D9534F",
      },
      fontFamily: {
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
