# Contributing

The Why Grief Matters project is made possible by a group of dedicated volunteers. We welcome contributions of all sizes and skill levels, and we also welcome enquiries from those wanting to work on the project over the long term.

**Questions?** Reach out to Dan Chambers (technical lead) at dan@whygriefmatters.org.

> [!Tip]
>
> If you're new to contributing to open source on GitHub, check out [first-contributions](https://github.com/firstcontributions/first-contributions) for a gentle introduction.

## Prerequisites

- **Node.js** — install the version specified in `.nvmrc` (we recommend using [nvm](https://github.com/nvm-sh/nvm))
- **npm** — comes with Node.js

## Getting Started

See [README](./README.md) for getting set up for development.

## Requesting API Tokens

Some features require secret API tokens (Sanity, Resend, Clerk). These are **not** included in the repo. Contact Dan Chambers at dan@whygriefmatters.org to request access. Please include your GitHub username so we can add you to the project.

## Git Workflow

1. Create a branch from `main` using a descriptive prefix:
   - `feature/` — new features
   - `fix/` — bug fixes
   - `docs/` — documentation changes
2. Make your changes in small, focused commits
3. Before opening a PR, make sure all checks pass:
   ```bash
   npm run lint
   npm run format:check
   npm run typecheck
   ```
4. Open a pull request against `main` and fill out the PR template

## Finding Work

- Check the [issue tracker](https://github.com/grief-matters/whygriefmatters.org/issues) for open issues
- Issues labeled **`good first issue`** are great starting points for new contributors
- If you'd like to work on something not listed, open an issue first to discuss it
