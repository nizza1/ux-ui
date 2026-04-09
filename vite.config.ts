import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  resolve: {
    alias: {
      "~": resolve(__dirname, "app"),
    },
  },
  plugins: [
    tailwindcss(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
  ],
});
