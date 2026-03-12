import { CSSOptions, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import autoImport from "unplugin-auto-import/vite";

// https://vitejs.dev/config
export default defineConfig({
  plugins: [
    react({ jsxRuntime: "automatic" }),
    tailwindcss(),
    autoImport({
      imports: [
        "react",
        "react-dom",
        {
          "react-router": [
            "Link",
            "useHref",
            "useLocation",
            "useNavigate",
            "useParams",
            "useResolvedPath",
          ],
        },
        "react-i18next",
        "ahooks",
        {
          clsx: ["clsx"],
        },
      ],
      dts: "renderer/auto-imports.d.ts",
      eslintrc: {
        enabled: true,
        filepath: "renderer/.eslintrc-auto-import.json",
      },
    }),
  ],
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
