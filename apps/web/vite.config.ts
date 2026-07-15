import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// LocalIA — Frontend Architecture Specification §3.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
