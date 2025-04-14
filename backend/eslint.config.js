import globals from "globals";
import nestjsPlugin from "@nestjs/eslint-plugin";

import parentConfig from "../eslint.config.js";

export default [
  ...parentConfig,
  {
    plugins: {
      "@nestjs": nestjsPlugin,
    },
    rules: {
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@nestjs/controller-methods-should-be-public": "error",
      "@nestjs/injectable-should-be-provided": "error",
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
