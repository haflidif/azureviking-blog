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

- **Cover image dimensions:** Existing covers vary (1024x576, 1200x630, 1024x512). Standardized on **1200x630** (OG image standard) for new covers — matches social preview requirements.
- **Cover image style:** Dark navy-to-blue gradient background with subtle grid pattern, topic-relevant iconography (shield/locks for security posts), title text, subtitle, and tag pills. Corner accents for framing.
- **File size target:** Generated PNG covers compress well at ~49 KB with `optimize=True`. No need for lossy compression for these programmatic images.
- **Font fallback:** System `arial.ttf` is available on Windows for Pillow text rendering. Works well for cover generation.
- **Cover generation approach:** Python/Pillow script generates covers programmatically — no external image assets needed. Good for consistent branding.

## Cross-Agent Updates (2026-03-02T15:38)

**Content path decision:** All asset work for blog posts targets `site/assets/images/posts/{slug}/` per team decision.
