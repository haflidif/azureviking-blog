# Project Context

- **Owner:** Haflidi Fridthjofsson
- **Project:** AzureViking Blog — technical blog with posts, tutorials, and conference recaps
- **Stack:** Astro 5, Svelte 5, TypeScript, Tailwind CSS v4, pnpm
- **Hosting:** GitHub Pages at azureviking.com
- **Created:** 2026-03-02T15:24:14Z

## Key References

- `site/assets/images/posts/{slug}/` — post-specific images
- `site/assets/` — Astro publicDir (NOT `public/`)
- `.github/copilot/agents/blog-writer.md` — image conventions section

## Learnings

- **Asset structure:** Post-specific images go in `site/assets/images/posts/{slug}/`. The `site/assets/` directory is Astro's publicDir (NOT `public/`). This is confirmed by team decision in `.squad/decisions.md`.

## Cross-Agent Updates (2026-03-02T15:38)

**Content path decision:** All asset work for blog posts targets `site/assets/images/posts/{slug}/` per team decision.
