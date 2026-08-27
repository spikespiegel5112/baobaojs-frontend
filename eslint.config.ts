import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // 基础 JS 规则
  js.configs.recommended,

  // TypeScript 规则
  ...tseslint.configs.recommended,

  // React 推荐规则
  pluginReact.configs.flat.recommended,

  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        Button: "readonly",
        DatePicker: "readonly",
        Form: "readonly",
        Input: "readonly",
        Table: "readonly",
        Pagination: "readonly",
        Space: "readonly",
        Flex: "readonly",
        Col: "readonly",
        Row: "readonly",
        Layout: "readonly",
        Modal: "readonly",
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,

      // TypeScript 文件由 @typescript-eslint/no-unused-vars 负责，避免与基础规则重复报错。
      "no-unused-vars": "off",
      "react/react-in-jsx-scope": "off", // React 17+ 不需要显式 import React
      "react/jsx-no-undef": "off",
      "react-hooks/exhaustive-deps": "off",
    },
    settings: {
      react: {
        version: "detect", // 自动检测 React 版本
      },
    },
  },
]);
