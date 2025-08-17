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
});
