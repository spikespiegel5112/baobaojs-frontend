import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import type { ProxyOptions } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import { visualizer } from "rollup-plugin-visualizer";

const pathSrc = path.resolve(__dirname, "src");

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiProxy = {
    "/baobaoapi": {
      target: env.VITE_API_URL,
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\//, "/"),
      configure(proxy: Parameters<NonNullable<ProxyOptions["configure"]>>[0]) {
        proxy.on("error", (err, req, res) => {
          console.error("Proxy error:", err.message);

          if (!res.headersSent) {
            res.writeHead(503, {
              "Content-Type": "application/json",
            });
          }

          res.end(
            JSON.stringify({
              message: "Backend service unavailable",
              code: "BACKEND_UNAVAILABLE",
            }),
          );
        });
      },
    },
  };

  return {
    appType: "spa",
    plugins: [
      tailwindcss(),
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
        open: false,
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
      proxy: apiProxy,
    },
    preview: {
      proxy: apiProxy,
    },
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          if (
            warning.code === "MODULE_LEVEL_DIRECTIVE" &&
            warning.message.includes('"use client"')
          ) {
            return;
          }
          warn(warning);
        },
      },
    },
  };
});
