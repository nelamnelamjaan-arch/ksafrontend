import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = __dirname;
// Monorepo root (parent of `client/`) — optional local `.env` when developing in the full repo.
const repoRoot = path.resolve(clientDir, "..");

export default defineConfig(({ mode }) => {
  loadEnv(mode, clientDir, "");
  if (mode !== "production") {
    loadEnv(mode, repoRoot, "");
  }
  return {
    // Standalone Vercel client repo: read `client/.env*` only. Monorepo dev still picks up parent vars above.
    envDir: clientDir,
    plugins: [react()],
    optimizeDeps: {
      include: [
        "react",
        "react/jsx-runtime",
        "react-dom",
        "react-dom/client",
        "react-router-dom",
        "@react-oauth/google",
        "framer-motion",
      ],
    },
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
        },
        "/socket.io": {
          target: "http://localhost:5000",
          changeOrigin: true,
          ws: true,
        },
        "/sitemap.xml": {
          target: "http://localhost:5000",
          changeOrigin: true,
        },
        "/robots.txt": {
          target: "http://localhost:5000",
          changeOrigin: true,
        },
      },
    },
  };
});
