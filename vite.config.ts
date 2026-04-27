import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// На GitHub Pages сайт лежит по пути /<repo>/, поэтому в прод-сборке
// все ассеты должны ссылаться на /portfo2/...; в dev (npm run dev) — на /.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/portfo2/" : "/",
  server: {
    port: 5173,
    host: true,
  },
}));
