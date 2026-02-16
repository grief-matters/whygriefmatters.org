/// <reference types="astro/client" />
/// <reference types="@clerk/astro/env" />

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Locals extends Runtime {}
}
