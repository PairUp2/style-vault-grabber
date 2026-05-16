import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  plugins: [
    tanstackRouter(),
    tanstackStart(),
    react(),
    tsconfigPaths(),
  ],
  server: {
    port: 8080,
    host: "::",
  },
});
