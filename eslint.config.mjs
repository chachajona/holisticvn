import { defineConfig, globalIgnores } from "eslint/config";
import { fixupConfigRules } from "@eslint/compat";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  // Next's React/import/a11y plugins still use context methods removed in ESLint 10.
  ...fixupConfigRules([...nextVitals, ...nextTypeScript]),
  globalIgnores([
    ".next/**",
    ".context/**",
    ".agents/**",
    ".claude/**",
    ".impeccable/**",
    ".playwright-mcp/**",
    "node_modules/**",
    "coverage/**",
    "migration-output/**",
    "dist/**",
    "out/**",
    "next-env.d.ts",
  ]),
  {
    files: ["**/*.{js,mjs,ts,tsx}"],
    rules: { "no-debugger": "error", "no-eval": "error" },
  },
  {
    // Email HTML is rendered outside Next.js; its font links target mail clients.
    files: ["emails/**/*.tsx"],
    rules: { "@next/next/no-page-custom-font": "off" },
  },
]);
