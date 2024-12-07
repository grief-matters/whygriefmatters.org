import { defineConfig, envField } from "astro/config";

import tailwind from "@astrojs/tailwind";
import clerk from "@clerk/astro";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  integrations: [clerk(), tailwind({ applyBaseStyles: false })],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    imageService: "passthrough",
  }),
  output: "hybrid",
  experimental: {
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
  },
});