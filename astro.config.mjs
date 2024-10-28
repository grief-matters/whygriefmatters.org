import { defineConfig, envField } from "astro/config";

import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind({ applyBaseStyles: false })],
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
      },
    },
  },
});
