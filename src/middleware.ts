import { defineMiddleware } from "astro:middleware";

// Site is in development. Static assets get `X-Robots-Tag` from public/_headers,
// but that file does NOT apply to Worker-generated (SSR / action) responses.
// This middleware stamps the same noindex signal on those responses so nothing
// the Worker emits can be indexed. Remove at public launch.
export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
});
