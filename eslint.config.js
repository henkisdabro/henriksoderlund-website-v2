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
      // to see .astro files at all. BaseLayout, ThemeToggle and ContactForm
      // were converted with the CustomEvent refactor; src/pages/index.astro
      // (25) and src/components/NavigationBox.astro (22) still need a pass.
      // Left as a warning until they get one, so CI does not turn red - flip
      // this to "error" once those two files are clear.
      "no-var": "warn",
    },
  },
);
