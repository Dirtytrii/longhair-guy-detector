import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#15130f",
        soot: "#0d0c0a",
        paper: "#d6cebd",
        dim: "#8f8779",
        rust: "#b7483e",
        moss: "#5b6048",
        line: "#5b5348",
      },
      fontFamily: {
        serifcn: ["STSong", "SimSun", "Noto Serif SC", "serif"],
        sanscn: ["Inter", "PingFang SC", "Microsoft YaHei", "sans-serif"],
      },
      boxShadow: {
        paper: "0 16px 40px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [],
} satisfies Config;
