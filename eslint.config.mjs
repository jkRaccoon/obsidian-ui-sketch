import tsparser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";
import obsidianmd from "eslint-plugin-obsidianmd";

export default defineConfig([
  ...obsidianmd.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsparser,
      parserOptions: { project: "./tsconfig.json" },
    },
  },
  {
    ignores: [
      "main.js",
      "node_modules/",
      "tests/**/__snapshots__/**",
      "scripts/**",
      "esbuild.config.mjs",
      "*.config.mjs",
      "*.config.mts",
    ],
  },
]);
