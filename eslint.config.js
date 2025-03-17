import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tseslintParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import eslintPluginPrettier from "eslint-plugin-prettier";

export default [
  {
    ignores: [
      ".git",
      "node_modules",
      "build",
      "shared/build",
      "shared/node_modules",
      "frontend/build",
      "frontend/node_modules",
      "backend/build",
      "backend/node_modules",
      ".idea",
    ],
  },
  eslint.configs.recommended,
  {
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        project: ["./tsconfig.json", "./*/tsconfig.json"],
        sourceType: "module",
        ecmaVersion: 2022,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      prettier: eslintPluginPrettier,
      import: importPlugin,
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        { accessibility: "explicit" },
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "interface",
          format: ["PascalCase"],
          prefix: ["I"],
        },
        {
          selector: "typeAlias",
          format: ["PascalCase"],
        },
      ],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "never",
          alphabetize: { order: "asc" },
        },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prettier/prettier": "error",
      quotes: ["error", "double"],
      semi: ["error", "always"],
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },
  {
    files: ["backend/**/*.ts"],
    rules: {
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],
    },
  },
];
