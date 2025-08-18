import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";

const pathSrc = path.resolve(__dirname, "app");

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),

    AutoImport({
      imports: [
        {
          antd: [
            "Button",
            "DatePicker",
            "Form",
            "Input",
            "Table",
            "Pagination",
            "Space",
            "Flex",
            "Col",
            "Row",
          ],
        },
      ],
      dts: "src/auto-imports.d.ts", // 生成类型声明文件
    }),
  ],
  resolve: {
    alias: {
      "~/": `${pathSrc}/`,
      "@/": `${pathSrc}/`,
    },
  },
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
