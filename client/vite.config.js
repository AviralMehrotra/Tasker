import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",

  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          charts: ["recharts"],
          dnd: ["@hello-pangea/dnd"],
          redux: ["@reduxjs/toolkit", "react-redux"],
          icons: ["lucide-react", "react-icons"],
          ui: ["@headlessui/react", "moment", "clsx", "sonner"],
        },
      },
    },
  },
});
