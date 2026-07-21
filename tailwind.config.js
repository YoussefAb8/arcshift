/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#080C14",
        panel: "#0D1220",
        card: "#111827",
        line: "rgba(99,90,255,0.15)",
        "line-strong": "rgba(99,90,255,0.3)",
        paper: "#E8E6FF",
        muted: "#6B7280",
        "muted-light": "#9CA3AF",
        brand: "#635AFF",
        "brand-light": "#A78BFA",
        "brand-dim": "#4C45CC",
        success: "#22C55E",
        danger: "#EF4444",
        pending: "#F59E0B",
        white: "#FFFFFF",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        display: ["Space Grotesk", "ui-sans-serif"],
        mono: ["ui-monospace", "monospace"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #635AFF, #A78BFA)",
        "hero-glow": "radial-gradient(ellipse at top right, rgba(99,90,255,0.15) 0%, transparent 60%)",
        "card-gradient": "linear-gradient(135deg, rgba(99,90,255,0.08), rgba(167,139,250,0.04))",
      },
    },
  },
  plugins: [],
};
