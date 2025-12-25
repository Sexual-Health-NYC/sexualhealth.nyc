import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tidewave from "tidewave/vite-plugin";
import { execSync } from "child_process";

// Get git hash - prefer Vercel's env var, fallback to git command
let commitHash =
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || // Vercel provides full SHA
  (() => {
    try {
      return execSync("git rev-parse --short HEAD").toString().trim();
    } catch {
      return "dev";
    }
  })();

export default defineConfig({
  plugins: [react(), tailwindcss(), tidewave()],
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
