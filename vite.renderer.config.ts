import { CSSOptions, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

// https://vitejs.dev/config
export default defineConfig({
  plugins: [react({ jsxRuntime: "automatic" }), tailwindcss()],
  publicDir: "public",
  css: {
    transformer: "lightningcss" as CSSOptions["transformer"],
  },
  build: {
    target: "es2022",
    rollupOptions: {
      input: [
        resolve(__dirname, "html/index.html"),
        resolve(__dirname, "html/dialog.html"),
        resolve(__dirname, "html/setting.html"),
      ],
    },
  },
  resolve: {
    alias: {
      "@common": resolve(__dirname, "common"),
      "@main": resolve(__dirname, "main"),
      "@renderer": resolve(__dirname, "renderer"),
      "@locales": resolve(__dirname, "locales"),
    },
  },
});
