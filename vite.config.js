import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "src",
  //base: '/vite-firebase-auth/',
  server: {
    host: "127.0.0.1",
    port: 5173
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "src/index.html"),
        onboarding: resolve(__dirname, "src/onboarding.html"),
        home: resolve(__dirname, "src/home.html")
      }
    }
  }
});
