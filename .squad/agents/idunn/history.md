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

## Squad on ACA Visuals (2026-07-14)

**Created 5 images** for `squad-on-aca-serverless-ai-agents` post:

| File                   | Dimensions | Size  | Purpose                                                                      |
| ---------------------- | ---------- | ----- | ---------------------------------------------------------------------------- |
| cover.png              | 1200×630   | 28 KB | OG cover — Azure gradient + container geometry                               |
| architecture-flow.png  | 1200×700   | 44 KB | Full pipeline: Issue → Actions → Queue → KEDA → ACA Job → PR + feedback loop |
| dual-token-pattern.png | 1200×630   | 51 KB | GitHub App Token vs Copilot PAT with GIT_ASKPASS swap                        |
| scale-to-zero.png      | 1200×630   | 42 KB | Idle ($0) vs Active side-by-side panels                                      |
| iteration-journey.png  | 1200×630   | 59 KB | 4 per-agent jobs → 1 generic job simplification                              |

**Techniques learned:**

- **RGBA compositing for covers:** RGB mode doesn't support semi-transparent fills. Use `Image.new('RGBA')` + `Image.alpha_composite()` for transparent overlays (grid, tag pills), then convert to RGB for final save.
- **Unicode dollar sign:** Pillow with Segoe UI may clip the `$` character in string literals. Using `\u0024` ensures reliable rendering.
- **Segoe UI font family:** `segoeuib.ttf` (bold), `segoeui.ttf` (regular), `segoeuil.ttf` (light) all available on Windows — excellent for technical diagrams.
- **Color palette for Azure/GitHub diagrams:** GitHub purple (#6e5494), Azure blue (#0078D4), output green (#28a745), with orange (#FF9800) and purple (#9C27B0) for token differentiation.
- **Architecture diagram layout:** 1200×700 (slightly taller than standard) works better for flow diagrams with feedback loops — gives room for the return path without cramping.
- **Unicode glyph rendering:** Segoe UI on Windows does NOT reliably render checkmarks (✓ U+2713) or cross marks (✗) via Pillow — they appear as empty squares. Draw checkmarks manually using `ImageDraw.line()` (two strokes: short down-right + long up-right). Use `ellipse()` for bullet points instead of bullet Unicode chars.
- **Arrow fan-out in diagrams:** When multiple arrows connect to the same shape, spread entry/exit points along the edge (different Y positions) instead of converging to a single point. This avoids visual clutter.
- **Logo integration on covers:** Download external logos (e.g., Squad logo as .webp), place inside a dark rounded rectangle with a glow effect (concentric semi-transparent circles behind it). Use RGBA compositing layers: gradient base → grid → glow → dark square → logo → text.
- **Rework iteration:** First pass often reveals rendering issues (RGBA vs RGB, missing glyphs, arrow convergence). Budget for a verification + fix pass after initial generation.
- **Conceptual diagrams:** Side-by-side panel layout (idle/active, before/after) is highly effective for showing state transitions and simplification journeys.

## Session: Squad ACA Blog Post (2026-04-17T08:11:44.9637043Z)

- Participated in multi-agent blog content creation
- Delivered on all assigned tasks
- Coordinated with Tyr (planning), Bragi (content), Idunn (visuals)
- Post ready for review at site/content/posts/squad-on-aca-serverless-ai-agents.md
