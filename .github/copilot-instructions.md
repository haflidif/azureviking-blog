# Copilot Instructions — AzureViking Blog

## Tech Stack

- **Framework:** Astro 5 with Svelte 5 components
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript (strict mode)
- **Package manager:** pnpm
- **Hosting:** GitHub Pages with custom domain `azureviking.com`

## Commands

- **Build:** `pnpm build`
- **Dev:** `pnpm dev`
- **Lint:** `pnpm lint`
- **Type-check:** `pnpm check`
- **Format:** `pnpm format`

## File Structure

- `src/content/posts/` — Blog post markdown files
- `src/components/` — Svelte and Astro components
- `src/pages/` — Astro page routes
- `src/layouts/` — Layout components
- `src/lib/` — Utilities, types, helpers
- `site/config.ts` — Site-wide configuration
- `site/assets/` — Static files (images, fonts). This is the Astro `publicDir`, NOT `public/`.
- `site/assets/images/posts/{slug}/` — Post-specific images

## Key Conventions

- **Base path:** Use `basePath()` from `src/lib/utils/basePath.ts` for internal URLs. With the custom domain, the base is `/`.
- **Image references in markdown:** Use `/images/posts/{slug}/filename.png`
- **Content schema:** Defined in `src/content.config.ts` with Zod validation
- **Categories:** `blog`, `talk`, `tutorial`, `lab`, `news`, `podcast`
- **Svelte 5:** Use runes (`$state`, `$derived`, `$effect`), not legacy reactive syntax

## Git

- **Default branch:** `main`
- **Commit style:** Conventional commits (`feat:`, `fix:`, `chore:`, `docs:`)
- **Pre-push hooks:** Lefthook runs lint + type-check (~30s)
- **GPG signing:** Enabled. Use `-c commit.gpgsign=false` for automated commits.

## Deployment

- GitHub Actions deploys on push to `main`
- LinkedIn auto-post triggers after successful deploy
- Site URL: `https://azureviking.com`

## Code Quality Expectations

- **Simplicity first.** Make every change as simple as possible. Impact minimal code.
- **Root causes only.** Find and fix the actual problem. No temporary workarounds or band-aids.
- **Prove it works.** Never consider a task complete without verifying. Run `pnpm build`, `pnpm lint`, `pnpm check` as appropriate. Diff behavior between `main` and your changes when relevant.
- **Demand elegance.** For non-trivial changes, pause and ask "is there a more elegant way?" If a fix feels hacky, implement the proper solution. Skip this for simple, obvious fixes.
- **Minimal impact.** Changes should only touch what's necessary. Avoid introducing unrelated changes or regressions.
- **Senior-level standards.** Ask yourself: "Would a staff engineer approve this?" Write code that's clear, maintainable, and well-structured.
