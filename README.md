# Why Grief Matters Website

Welcome to the Why Grief Matters Website repository! This repository hosts the source code for the Why Grief Matters website.

If you have lost someone and are looking for support, or you're supporting someone else, please visit the website: [whygriefmatters.org](https://www.whygriefmatters.org).

## Table of Contents

- [Quick Start](#quick-start)
- [Getting Set Up](#getting-set-up)
- [Architecture](#architecture)
- [Theming & Design Tokens](#theming--design-tokens)
- [Developer Guides](#developer-guides)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

---

## Quick Start

```bash
git clone https://github.com/grief-matters/whygriefmatters.org
cd whygriefmatters.org
nvm use                # Node 24.13.0
npm install
```

Create `.env` in the project root:

```shell
SANITY_STUDIO_API_VERSION="2023-07-16"
SANITY_STUDIO_DATASET="production"
SANITY_STUDIO_PROJECT_ID="vg3sb730"
SANITY_AUTH_TOKEN="<your-sanity-token>"

PUBLIC_CLERK_PUBLISHABLE_KEY="<your-clerk-publishable-key>"
CLERK_SECRET_KEY="<your-clerk-secret-key>"

RESEND_API_KEY="<your-resend-api-key>"
RESEND_FROM_ADDRESS="Why Grief Matters <system@noreply.whygriefmatters.org>"
RESEND_TO_ADDRESS="contact@whygriefmatters.org"
```

Create `.dev.vars` in the project root (used by Wrangler for local preview):

```shell
SANITY_AUTH_TOKEN="<your-sanity-token>"
CLERK_SECRET_KEY="<your-clerk-secret-key>"
RESEND_API_KEY="<your-resend-api-key>"
```

```bash
npm run dev            # Start dev server at http://localhost:4321
```

See [Getting Set Up](#getting-set-up) below for details on each step.

---

## Getting Set Up

### Prerequisites

- **Node.js v24.13.0** — pinned in `.nvmrc`. Use [nvm](https://github.com/nvm-sh/nvm) to switch: `nvm use`
- **npm** — comes with Node

### Environment Variables

The project needs two env files:

| File | Used by | Purpose |
|------|---------|---------|
| `.env` | Astro dev server | All environment variables (public and secret) |
| `.dev.vars` | Wrangler (`npm run preview`) | Secret variables only — Wrangler reads public vars from `wrangler.toml` |

**Variable reference:**

| Variable | Access | Where to get it |
|----------|--------|-----------------|
| `SANITY_STUDIO_API_VERSION` | Public | Pre-configured: `"2023-07-16"` |
| `SANITY_STUDIO_DATASET` | Public | Pre-configured: `"production"` |
| `SANITY_STUDIO_PROJECT_ID` | Public | Pre-configured: `"vg3sb730"` |
| `SANITY_AUTH_TOKEN` | Secret | [Sanity dashboard](https://www.sanity.io/manage) → API → Tokens |
| `PUBLIC_CLERK_PUBLISHABLE_KEY` | Public | [Clerk dashboard](https://dashboard.clerk.com/) → API Keys |
| `CLERK_SECRET_KEY` | Secret | Clerk dashboard → API Keys |
| `RESEND_API_KEY` | Secret | [Resend dashboard](https://resend.com/) → API Keys |
| `RESEND_FROM_ADDRESS` | Public | Pre-configured (see Quick Start) |
| `RESEND_TO_ADDRESS` | Public | Pre-configured (see Quick Start) |

> [!NOTE]
> The Clerk publishable key and Wrangler public vars are already configured in `wrangler.toml`, so `.dev.vars` only needs the secret values.

### Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Generates Wrangler types, then starts the Astro dev server |
| `npm run build` | Generates Wrangler types → runs `astro check` (type checking) → builds the site → runs Pagefind indexing |
| `npm run preview` | Generates Wrangler types, then runs `wrangler dev` to simulate the Cloudflare Workers environment locally |

---

## Architecture

### Tech Stack

| Dependency | Role |
|-----------|------|
| [Astro 5](https://astro.build/) | Static site generator with content collections and file-based routing |
| [TypeScript](https://www.typescriptlang.org/) (strict) | Type safety across components and content |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling with custom design tokens |
| [Sanity.io](https://www.sanity.io/) | Headless CMS — all resources, categories, and populations |
| [Zod](https://zod.dev/) | Runtime validation of CMS data at build time |
| [Clerk](https://clerk.com/) | Authentication |
| [Cloudflare Workers](https://workers.cloudflare.com/) / Wrangler | Deployment target and local preview |
| [Pagefind](https://pagefind.app/) | Static search indexing (runs post-build) |

### Data Loading & Content Collections

Content flows from the CMS to rendered pages through a pipeline:

1. **GROQ queries** (`/src/content/queries/*.groq`) define what data to fetch from Sanity.
2. **Loaders** (`/src/content/loaders/sanityQueryLoader.ts`) execute queries against the Sanity client and validate results with Zod. A generic `loadSanityQuery()` function handles most collections.
3. **Zod schemas** (`/src/content/model/*.ts`) validate and type the fetched data. If the CMS data doesn't match the schema, the build fails with detailed error output.
4. **Content config** (`/src/content.config.ts`) registers each collection, wiring together queries, loaders, and schemas. Internet resource types (articles, books, podcasts, etc.) share a common collection definition via `getBasicInternetResourceCollectionDef()`.
5. **Pages** access data with `getCollection()` / `getEntry()` from `astro:content` in their frontmatter.

### Component Organization

Components are organized into tiers by responsibility:

| Tier | Directory | Purpose | Examples |
|------|-----------|---------|---------|
| Base | `/src/components/base/` | Atomic reusable elements — no business logic | `Button`, `Stack`, `Container`, `Typography`, `Link`, `Icon` |
| Composite | `/src/components/composite/` | Feature-specific combinations of base components | `Card`, `SiteHeader`, `SiteFooter` |
| Scripted | `/src/components/scripted/` | Components with client-side JavaScript | Main navigation, resource listings controller, `Search` |
| Layouts | `/src/components/layouts/` | Page structure wrappers | `Shell`, `SitePageLayout`, `PageHeaderLayout` |
| Utils | `/src/components/utils/` | Shared helper functions for components | Spacing, styles, icon definitions, navigation utilities |

A typical page composes these tiers: `Shell` wraps the full page → `SitePageLayout` provides the standard page structure → content is built from base and composite components inside `Container` and `LayoutSurface`.

### Design Tokens & Styling

Styles live in `/src/styles/`:

- **`tokens.css`** — raw color palette and spacing values
- **`main.css`** — maps tokens to semantic Tailwind theme variables (e.g., `layoutSurface`, `contentSurface`, `onSurface`, `line`)

The color system uses four semantic layers: `layoutSurface` (page backgrounds), `contentSurface` (cards, panels), `onSurface` (text, icons), and `line` (borders, dividers). See [Theming & Design Tokens](#theming--design-tokens) for the full reference.

---

## Theming & Design Tokens

The visual design system is built in three layers:

1. **Primitive tokens** (`/src/styles/tokens.css`) — raw color values using `--token-color-{family}-{lightness}` naming (e.g. `--token-color-blue-91`)
2. **Semantic mapping** (`/src/styles/main.css` via Tailwind 4 `@theme`) — maps primitive tokens to purpose-driven CSS custom properties
3. **Component API** (`/src/components/utils/styles.ts` + component props) — type-safe TypeScript maps that resolve to Tailwind utility classes

### Color System

Colors are organized into four semantic layers. Each layer has **variants** (the color family) and **prominence levels** (the visual weight).

#### Layout Surface

Page section backgrounds. Uses numbered keys for ordering rather than prominence.

```
bg-layoutSurface-{variant}--{number}
```

Available: `neutral` (1–4), `primary` (1), `primaryContrast` (1–2), `secondary` (1), `tertiary` (1–3)

#### Content Surface

Card, panel, and interactive element backgrounds.

```
bg-contentSurface-{variant}--{prominence}
```

| Variant | Prominence levels |
|---------|-------------------|
| `neutral` | `muted`, `default`, `prominent` |
| `primary` | `muted`, `default`, `prominent` |
| `primaryContrast` | `muted`, `default`, `prominent` |
| `secondary` | `muted`, `default`, `prominent` |
| `tertiary` | `muted`, `default`, `prominent` |
| `donate` | `muted`, `default`, `prominent` |

#### On Surface

Text and icon colors.

```
text-onSurface-{variant}--{prominence}
```

| Variant | Prominence levels |
|---------|-------------------|
| `coolNeutral` | `default`, `muted` |
| `warmNeutral` | `default`, `muted` |
| `primary` | `default`, `muted` |
| `primaryContrast` | `default`, `muted` |
| `secondary` | `default`, `muted` |
| `tertiary` | `default`, `muted` |

#### Line

Borders and dividers.

```
border-line-{variant}--{prominence}
```

| Variant | Prominence levels |
|---------|-------------------|
| `neutral` | `muted`, `default`, `prominent` |
| `coolNeutral` | `muted`, `default` |
| `primary` | `muted`, `default`, `prominent` |
| `primaryContrast` | `default`, `muted` |
| `secondary` | `muted`, `default`, `prominent` |
| `tertiary` | `muted`, `default`, `prominent` |
| `brand` | `accent` |

### Text Presets

Text presets are defined in `/src/components/utils/styles.ts` and consumed via the `Typography` component. Each preset specifies a font family, size, and weight.

| Preset | Font | Size | Weight |
|--------|------|------|--------|
| `title-1` | serif | 4xl | bold |
| `title-2` | serif | 3xl | bold |
| `title-3` | serif | 2xl | bold |
| `title-4` | serif | xl | bold |
| `title-5` | serif | lg | bold |
| `body-1` | serif | base | normal |
| `body-2` | serif | lg | normal |
| `body-small` | serif | sm | normal |
| `subtitle-1` | sans-b | sm | normal |
| `button-1` | sans-a | base | bold |
| `button-2` | serif | base | bold |

### Fonts

Three font families are defined in `main.css` via `@theme` (sourced from [Modern Font Stacks](https://modernfontstacks.com)):

| Token | Primary font | Category |
|-------|-------------|----------|
| `font-serif` | Charter | Transitional |
| `font-sans-a` | Seravek / Gill Sans Nova | Humanist |
| `font-sans-b` | Optima / Candara | Classical Humanist |

### Spacing Scale

A 1–7 semantic spacing scale is defined in `/src/components/utils/spacing.ts`. Components accept a `SpaceSetting` (1–7) rather than raw Tailwind values, keeping spacing consistent.

| Level | Tailwind value | rem |
|-------|---------------|-----|
| 1 | `1.5` | 0.375 |
| 2 | `3` | 0.75 |
| 3 | `4` | 1 |
| 4 | `6` | 1.5 |
| 5 | `8` | 2 |
| 6 | `12` | 3 |
| 7 | `16` | 4 |

---

## Developer Guides

### Adding a New Page

1. Create an `.astro` file in `/src/pages/` (file path = URL route).
2. Import and wrap with `SitePageLayout` (which handles the `Shell`, header, footer).
3. Fetch content via `getCollection()` or `getEntry()` in frontmatter.
4. Compose with base/composite components inside `Container` and `LayoutSurface`.

### Adding a New Content Type

1. Write a GROQ query in `/src/content/queries/<name>.groq`.
2. Create a Zod schema in `/src/content/model/<name>.ts`.
3. Register the collection in `/src/content.config.ts` using `defineCollection()` with `loadSanityQuery()`.
4. Access data via `getCollection("<name>")` in pages.

For internet resources that follow the standard shape, use `getBasicInternetResourceCollectionDef()` instead of a custom definition.

### Adding a New Component

- **Choose the right tier**: base (reusable, no business logic) → composite (feature-specific) → scripted (needs client JS).
- Follow PascalCase naming: `MyComponent.astro`.
- Use existing base components (`Stack`, `Container`, `Typography`) for layout and text.
- For client-side interactivity, see the custom elements pattern in `/src/components/scripted/`.

### Working with Sanity Data

- Queries live in `.groq` files and are imported with `?raw` suffix.
- Schemas validate at build time — a mismatch produces clear error output showing the path and received data.
- Use `getImageUrlBuilder` from `@sanity-integration/sanity-image-builder` for constructing image URLs.

---

## Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── base/           # Atomic: Button, Stack, Container, Typography, etc.
│   │   ├── composite/      # Feature: Card, SiteHeader, SiteFooter
│   │   ├── scripted/       # Client JS: navigation, search, resource listings
│   │   ├── layouts/        # Shell, SitePageLayout, PageHeaderLayout
│   │   └── utils/          # Shared helpers (spacing, icons, styles)
│   ├── content/
│   │   ├── loaders/        # Sanity query loaders
│   │   ├── model/          # Zod schemas & TypeScript types
│   │   └── queries/        # GROQ query files
│   ├── content.config.ts   # Collection definitions
│   ├── integrations/
│   │   └── sanity/         # Sanity client setup
│   ├── pages/              # Astro file-based routes
│   ├── styles/             # Global CSS & design tokens
│   └── types/              # Shared TypeScript types
├── astro.config.mjs
├── tsconfig.json           # Path aliases: @ui/*, @content/*, @sanity-integration/*
├── wrangler.toml           # Cloudflare Workers config & public env vars
└── .nvmrc                  # Node version (24.13.0)
```

**Path aliases** (defined in `tsconfig.json`):

| Alias | Maps to |
|-------|---------|
| `@ui/*` | `src/components/*` |
| `@content/*` | `src/content/*` |
| `@sanity-integration/*` | `src/integrations/sanity/*` |

---

## Contributing

We welcome contributions of all sizes and skill levels. See the [Contributing guide](./CONTRIBUTING.md) for more information.
