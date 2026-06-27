import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/shopping-cart-full-stack/",
  server: {
    proxy: {
      "/products":
        "https://shopping-cart-full-stack-production-0bda.up.railway.app",
      "/carts":
        "https://shopping-cart-full-stack-production-0bda.up.railway.app",
      "/orders":
        "https://shopping-cart-full-stack-production-0bda.up.railway.app",
      "/payments":
        "https://shopping-cart-full-stack-production-0bda.up.railway.app",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});
