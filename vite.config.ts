import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { visualizer } from "rollup-plugin-visualizer"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./",
  plugins: [
    react(),
    mode === "analyse" &&
      visualizer({
        filename: "bundle-report.html",
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  define: {
    global: "globalThis",
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          highcharts: [
            "highcharts",
            "highcharts/highstock",
            "highcharts/modules/treemap",
            "highcharts/modules/exporting",
          ],
          phosphor: ["@phosphor-icons/react"],
        },
      },
    },
    chunkSizeWarningLimit: 1500,
  },
}))
