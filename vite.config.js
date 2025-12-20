import { defineConfig } from "vite";
import tidewave from "tidewave/vite-plugin";

export default defineConfig({
  plugins: [tidewave()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "index.html",
        embed: "test-embed.html",
      },
    },
  },
  publicDir: "public",
});
