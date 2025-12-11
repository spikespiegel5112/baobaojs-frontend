import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import { visualizer } from "rollup-plugin-visualizer";

const pathSrc = path.resolve(__dirname, "app");

export default defineConfig(({ mode }) => {
  const env = loadEnv("", process.cwd(), ""); // 第三个参数设为 '' 才能取到所有变量
  return {
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
              "Layout",
              "Modal",
              "Divider",
              "ConfigProvider",
            ],
          },
        ],
        dts: "src/auto-imports.d.ts", // 生成类型声明文件
      }),
      visualizer({
        filename: "./dist/stats.html", // 输出分析报告
        open: true, // 打包完成自动打开浏览器
        gzipSize: true,
      }),
    ],
    resolve: {
      alias: {
        "@/": `${pathSrc}/`,
        "~/": `${pathSrc}/`,
      },
    },
    server: {
      proxy: {
        "/baobaoapi": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\//, "/"),
        },
      },
    },
  };
});
