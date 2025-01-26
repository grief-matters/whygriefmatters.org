# Why Grief Matters Website

Welcome to the Why Grief Matters Website repository! This repository hosts the source code for the Why Grief Matters website.

If you have lost someone and are looking for support, or you're supporting someone else, please visit the website; [https://www.whygriefmatters.org](www.whygriefmatters.org).

---

## Contributing

We welcome contributions of all sizes and skill levels. There are a couple of different ways we accept contributions. See the [Contributing](./CONTRIBUTING.md) guide for more information.

---

## Quick Start Guide

1. Clone this repo `git clone https://github.com/grief-matters/whygriefmatters.org`
2. `cd` into the project
3. Create a file named `.env` in the root of your project and add to it the following environment variables:

   ```shell
    # Sanity Env Variables
    SANITY_STUDIO_API_VERSION="2023-07-16"
    SANITY_STUDIO_DATASET="production"
    SANITY_STUDIO_PROJECT_ID="[project_id]"
    SANITY_AUTH_TOKEN="[token]"

    # Clerk Env Variables
    PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_[key]"
    CLERK_SECRET_KEY="sk_test_[key]"
   ```
   
4. Create a file named `.dev.vars` in the root of your project with the contents:

   ```shell
   SANITY_AUTH_TOKEN="sk[token]"
   CLERK_SECRET_KEY="sk_test_[key]"
   ```

5. Run `npm install` at the root of the project to install all dependencies.
6. Run `npm run dev` at the root of the project folder. This will build and run the website locally.
7. Once the build is complete, you can head over to http://localhost:4321.

> [!WARNING] 
> When creating the files above be sure to replace the `[placeholder]` values with the ones you've been given

---

More detailed information for developers working on the project can be found in [docs](./docs/README.md)
