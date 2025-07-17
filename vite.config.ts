import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    svgr(), // SVG support
    wasm(), // WASM support
    topLevelAwait(), // Top-level await support
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Use @ for src
    },
  },
  optimizeDeps: {
    include: ["lucide-react"], // Pre-bundle lucide-react
    exclude: ["@cornerstonejs/dicom-parser"], // Avoid processing this
  },
  json: {
    stringify: false, // Optional: handle JSON more cleanly
  },
  build: {
    target: "es2020", // Enables top-level await and modern JS
  },
});
