import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";

export default tseslint.config(
  { ignores: ["dist", ".astro", "worker-configuration.d.ts"] },

  // Base JS rules for every linted file. Nesting this inside the block that
  // carries `files: ["**/*.{ts,tsx}"]` scoped it to TypeScript only, which
  // left the .mjs/.js build scripts and this config file with zero rules.
  js.configs.recommended,

  // Node scripts and config files.
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
  },

  {
    extends: [...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },

  // .astro components: frontmatter is server-side TypeScript, the template's
  // inline <script> is browser code. astro-eslint-parser handles both.
  ...astro.configs.recommended,
  {
    files: ["**/*.astro", "**/*.astro/*.{js,ts}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // `.astro` frontmatter is TypeScript and leans on Astro's ambient
      // types (`ImageMetadata`, `Astro`, ...). `no-undef` cannot see them and
      // is the rule typescript-eslint tells you to switch off in TS files;
      // `astro check` is what actually type-checks these.
      "no-undef": "off",
      // `var` in the inline <script> blocks predates this config being able
      // to see .astro files at all. Left as a warning rather than an error so
      // enabling .astro linting does not turn CI red - the fixes belong with
      // whoever owns those components. See the report for the file list.
      "no-var": "warn",
    },
  },
);
