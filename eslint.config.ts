import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import typescriptParser from "@typescript-eslint/parser";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import";
import electronPlugin from "@electron-toolkit/eslint-config";

export default defineConfig([
  globalIgnores([
    "**/*.d.ts",
    "**/*.js",
    "**/*.jsx",
    "**/*.json",
    "**/build/**",
  ]),
  js.configs.recommended,
  electronPlugin,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        MAIN_WINDOW_VITE_DEV_SERVER_URL: "readonly",
        MAIN_WINDOW_VITE_NAME: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      import: importPlugin,
    },
    extends: ["./renderer/.eslintrc-auto-import.json"],
  },
]);
