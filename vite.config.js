import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      "2036-2401-4900-5196-9220-f0f3-50ed-ab61-d635.ngrok-free.app",
    ],
  },
});
