import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import clerk from "@clerk/astro";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind({ applyBaseStyles: false }), clerk()],
  output: "hybrid",
  adapter: cloudflare({
    imageService: "passthrough",
    platformProxy: {
      enabled: true,
    },
  }),
});
