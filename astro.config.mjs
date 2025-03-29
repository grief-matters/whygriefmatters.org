import { defineConfig, envField } from "astro/config";

import clerk from "@clerk/astro";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [clerk()],
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    imageService: "passthrough",
  }),
  output: "static",
  env: {
    schema: {
      SANITY_STUDIO_API_VERSION: envField.string({
        context: "server",
        access: "public",
      }),
      SANITY_STUDIO_DATASET: envField.string({
        context: "server",
        access: "public",
      }),
      SANITY_STUDIO_PROJECT_ID: envField.string({
        context: "server",
        access: "public",
      }),
      SANITY_AUTH_TOKEN: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },
});
