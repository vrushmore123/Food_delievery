import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./", // 👈 Important for static site deployment
  plugins: [react()],
  server: {
    port: 3000,
  },
});
