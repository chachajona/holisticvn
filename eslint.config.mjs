import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "node:url";

const compat = new FlatCompat({ baseDirectory: fileURLToPath(new URL(".", import.meta.url)) });

export default [
  { ignores: [".next/**", ".context/**", ".agents/**", ".claude/**", ".impeccable/**", ".playwright-mcp/**", "node_modules/**", "coverage/**", "migration-output/**", "dist/**", "out/**", "next-env.d.ts"] },
  ...compat.extends("next/core-web-vitals"),
  {
    files: ["**/*.{js,mjs,ts,tsx}"],
    rules: { "no-debugger": "error", "no-eval": "error" },
  },
];
