# Project Context

- **Owner:** Haflidi Fridthjofsson
- **Project:** AzureViking Blog — technical blog with posts, tutorials, and conference recaps
- **Stack:** Astro 5, Svelte 5, TypeScript, Tailwind CSS v4, pnpm
- **Hosting:** GitHub Pages at azureviking.com
- **Created:** 2026-03-02T15:24:14Z

## Key References

- `src/components/` — Svelte and Astro components
- `src/pages/` — Astro page routes
- `src/layouts/` — Layout components
- `src/lib/utils/basePath.ts` — base path utility for internal URLs

## Learnings

- **Blog posts location:** Content lives in `site/content/posts/`, not `src/content/posts/`. This is critical for layout and routing work (see team decision in `.squad/decisions.md`).

- **Subscribe modal pattern:** The subscribe overlay modal in `Footer.astro` uses event delegation on `document` for open/close triggers (not `querySelectorAll` at init time). Any element with `data-subscribe-modal` attribute will open the modal — this works across Astro and Svelte boundaries without timing issues.
- **EmailOctopus integration (corrected 2026-03-02T20:07):** Both the footer form and modal form now use the **real EmailOctopus embed script** from `eocampaign1.com`. Previous custom form approach silently failed subscriptions due to no-cors mode. The modal visibility now uses `visibility: hidden` + `pointer-events: none` + `opacity: 0` instead of `display: none` — this allows the EmailOctopus script to initialize while keeping the modal hidden. When active, visibility/pointer-events/opacity toggle back. This prevents the script initialization failure that required custom forms. Domain is `eocampaign1.com`, NOT `eomail5.com`.
- **Mobile subscribe button:** `Header.svelte` mobile subscribe button uses `data-subscribe-modal` attribute — do NOT add inline DOM manipulation for modal logic. The Footer.astro delegated handler owns modal state.

## Cross-Agent Updates (2026-03-02T15:38)

**Content path decision:** Bragi's decision confirms all content work targets `site/content/posts/` per team decision in `.squad/decisions.md`.

## Subscribe Modal Fix (2026-03-02T18:20)

**Event delegation pattern established:** The subscribe modal now uses document-level event delegation instead of static `querySelectorAll()`. This fixes issue #2 (mobile button bypassing EmailOctopus). Any new subscribe trigger should use the `data-subscribe-modal` attribute — do NOT add inline DOM manipulation. The Footer.astro delegated handler owns all modal state.

See `.squad/decisions.md` for full rationale and affected agents.

## Dual EmailOctopus Form Fix (2026-03-02)

**Problem:** Having the same EmailOctopus embed script twice on one page (footer + modal) breaks the AJAX handler, causing a native GET fallback → 405 error.

**Fix:** Created a second EmailOctopus form (`modalFormId: 775b1b8c-166d-11f1-8ddb-47be6204b8d8`) dedicated to the subscribe modal. Added `modalFormId` to the `SiteConfig` type and config. Updated `Footer.astro` modal to use `SITE.newsletter.modalFormId` while the footer form keeps using `SITE.newsletter.formId`. Each form embed script now has a unique ID, so there's no AJAX handler collision.
