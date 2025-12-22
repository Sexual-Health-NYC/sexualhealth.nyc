import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tidewave from "tidewave/vite-plugin";
import { execSync } from "child_process";

// Get git hash
let commitHash = "dev";
try {
  commitHash = execSync("git rev-parse --short HEAD").toString().trim();
} catch (e) {
  console.warn("Could not get git hash", e);
}

export default defineConfig({
  plugins: [react(), tidewave()],
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },
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
