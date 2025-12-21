import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tidewave from "tidewave/vite-plugin";

export default defineConfig({
  plugins: [react(), tidewave()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "index.html",
        embed: "test-embed.html",
      },
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/mapbox-gl")) {
            return "mapbox-gl";
          }
        },
      },
    },
  },
  publicDir: "public",
});
