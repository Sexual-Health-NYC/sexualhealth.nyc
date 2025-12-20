import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tidewave from "tidewave/vite-plugin";

export default defineConfig({
  plugins: [react(), tidewave()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "index.html",
        map: "map.html",
        embed: "test-embed.html",
      },
    },
  },
  publicDir: "public",
});
