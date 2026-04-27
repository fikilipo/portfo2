/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        wild: ['"Times New Roman"', '"Comic Sans MS"', "serif"],
        web2: ["Verdana", "Tahoma", "Geneva", "sans-serif"],
        modern: ['"Manrope"', '"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', '"Fira Code"', "ui-monospace", "monospace"],
      },
      colors: {
        wild: {
          bg: "#0b0030",
          ink: "#ffffff",
          lime: "#39ff14",
          magenta: "#ff00d4",
          cyan: "#00f0ff",
          gold: "#ffd400",
        },
        web2: {
          bg: "#e7eef7",
          panel: "#ffffff",
          border: "#d4dbe5",
          ink: "#2b587a",
          accent: "#5181b8",
          like: "#e64646",
          orange: "#ff8c00",
        },
        eco: {
          bg: "#0a0a0c",
          ink: "#f4f4f5",
          dim: "#a1a1aa",
          line: "#1f1f23",
          accent: "#7c5cff",
          accent2: "#22d3ee",
        },
      },
      keyframes: {
        blink: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        flicker: {
          "0%,100%": { opacity: "1" },
          "45%": { opacity: ".82" },
          "50%": { opacity: ".4" },
          "55%": { opacity: ".88" },
        },
        glow: {
          "0%,100%": { boxShadow: "0 0 0 rgba(124,92,255,0)" },
          "50%": { boxShadow: "0 0 32px rgba(124,92,255,.55)" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        blink: "blink 1s steps(1,end) infinite",
        marquee: "marquee 22s linear infinite",
        flicker: "flicker 6s linear infinite",
        glow: "glow 3.5s ease-in-out infinite",
        floaty: "floaty 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
