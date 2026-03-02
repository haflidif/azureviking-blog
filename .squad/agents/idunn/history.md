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

- **Multi-image batch creation:** When creating a set of related images (e.g., conference post with cover + inline images), define shared constants (palette, fonts, helper functions) once and reuse across all image generators. This ensures visual consistency without duplicating code.
- **Image contracts for parallel work:** When collaborating with a content writer (e.g., Bragi), agree on slug, filenames, and dimensions upfront. The contract (slug + image names + dimensions) is the interface — both sides can work independently.
- **Inline blog images:** Same 1200x630 dimensions work well for inline post images too, not just covers. Consistent dimensions simplify responsive handling.
- **Distinct-but-consistent styling:** Use a shared color palette and background treatment (gradient + grid) across all images in a set, but vary accent colors and compositional elements (booths, cards, stage) per image to give each a unique identity.
- **File size range for batch:** A 4-image set (cover + 3 inline) at 1200x630 PNG with `optimize=True` totals ~150 KB — very web-friendly. Individual images range 24–53 KB.

## Cross-Agent Updates (2026-03-02T15:38)

**Content path decision:** All asset work for blog posts targets `site/assets/images/posts/{slug}/` per team decision.

## Collaboration Validation (2026-03-02T16:32)

**Bragi+Idunn parallel test:** Successfully executed 4 conference images in parallel with Bragi's post. Idunn created cover + 3 inline images at locked dimensions (1200x630) and palette. File sizes 24–53 KB. No rework needed. Test confirmed that parallel asset generation works when contract is locked upfront. Key takeaway: can deliver multi-image sets in parallel if content writer and image specialist agree on slug, filenames, dimensions, and count before either starts.
