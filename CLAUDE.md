# CLAUDE.md

This file provides guidance for Claude Code when working with this repository.

## Project Overview

Why Grief Matters (whygriefmatters.org) is a static website providing curated grief support resources. It aggregates various internet resources (articles, books, podcasts, videos, communities, etc.) organized by category and population.

## Tech Stack

- **Framework**: Astro 5.x with static site generation
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4.x with custom design tokens
- **CMS**: Sanity.io (headless CMS)
- **Auth**: Clerk
- **Deployment**: Cloudflare Workers via Wrangler
- **Node**: v24.13.0 (see .nvmrc)

## Commands

```bash
npm run dev       # Start development server
npm run build     # Production build (includes type checking)
npm run preview   # Preview production build on Cloudflare
```

## Project Structure

```
/src
├── /content          # Content layer & data models
│   ├── /loaders      # Sanity query loaders
│   ├── /queries      # GROQ queries (.groq files)
│   └── /model        # TypeScript types & Zod schemas
├── /pages            # Astro routes
├── /ui               # UI components (tiered architecture)
│   ├── /primitives   # Atomic components (Link, Stack, Container)
│   ├── /composites   # Feature components (Card, ResourceListing)
│   ├── /orchestrators # Smart data-rendering components
│   └── /layouts      # Page layouts (Shell)
├── /integrations/sanity  # Sanity client setup
└── /styles           # Global CSS & design tokens
```

## Path Aliases

- `@ui/*` - UI components
- `@content/*` - Content models and loaders
- `@styles/*` - Stylesheets
- `@server/*` - Server-side code
- `@sanity-integration/*` - Sanity client

## Key Conventions

### Component Architecture
- **Primitives**: Basic reusable components
- **Composites**: Feature-specific combinations
- **Orchestrators**: Smart components handling data and rendering logic

### Naming
- Components: PascalCase (`Card.astro`)
- Functions/variables: camelCase
- Content types: camelCase (`articleResourceType`)

### TypeScript
- Strict mode enabled
- Use type imports: `import type { Foo } from '...'`
- Unused params prefixed with `_` are allowed

### Styling
- Design tokens in `/src/styles/tokens.css` and `main.css`
- Color system: `layoutSurface`, `contentSurface`, `onSurface`
- Text presets: `title-1` through `title-4`, `body-1`, `body-2`

## Content & CMS

Content is fetched from Sanity and validated with Zod schemas. Key content types:
- Internet resources (articles, books, podcasts, videos, etc.)
- Categories (hierarchical)
- Populations (target audiences)

GROQ queries are in `/src/content/queries/`. Loaders in `/src/content/loaders/`.

## Environment Variables

Required for full functionality:
- `SANITY_AUTH_TOKEN` - Sanity API token (server-only)
- `PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `RESEND_API_KEY` - Email service key

Pre-configured (public):
- `SANITY_STUDIO_PROJECT_ID` - "vg3sb730"
- `SANITY_STUDIO_DATASET` - "production"
- `SANITY_STUDIO_API_VERSION` - "2023-07-16"
