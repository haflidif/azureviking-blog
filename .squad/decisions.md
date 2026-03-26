# Decisions

> Team decisions that affect everyone. Append-only. Managed by Scribe.

<!-- New decisions are appended below by Scribe after merging from decisions/inbox/ -->

## Content Path Convention (2026-03-02T15:38)

**What:** Blog posts and content files live in `site/content/posts/`, NOT `src/content/posts/`.

**Why:** The AzureViking Blog uses a `site/` directory structure for content and assets. The custom instructions incorrectly reference `src/content/posts/` but the authoritative path is `site/content/posts/`.

**Images:** Post-specific images go in `site/assets/images/posts/{slug}/`.

**Affected agents:** Bragi (content creation), Vidar (component/layout work), Heimdall (deployment), Idunn (asset management).

**Confirmed by:** Haflidi Fridthjofsson (via test blog post review).

## Standardized Inline Image Dimensions (2026-03-02T16:32)

**What:** All inline blog post images (not just covers) use **1200×630 px** dimensions — the same as OG/cover images.

**Why:** Consistent dimensions simplify responsive handling in templates. 1200px width is optimal for blog content areas and social sharing. 630px height maintains the 1.91:1 aspect ratio used by OG standards. Batch-generated PNGs at this size stay under 55 KB each with optimization.

**Affected agents:** Bragi (content references), Vidar (layout components), Idunn (image generation).

**Confirmed by:** Idunn (Image Specialist, via conference summary test).

## Subscribe Modal: Event Delegation Pattern (2026-03-02T18:20)

**What:** The subscribe overlay modal uses **document-level event delegation** for all trigger buttons instead of attaching handlers via `querySelectorAll` at initialization time.

**Why:** The previous approach had a timing dependency on Svelte component hydration — the mobile button in `Header.svelte` might not exist in the DOM when the Footer.astro script ran. Additionally, the mobile button had duplicated inline DOM manipulation that bypassed the EmailOctopus script injection, causing form redirects. Event delegation eliminates both issues: it works regardless of render order and centralizes modal logic.

**How:** Any element with the `data-subscribe-modal` attribute will open the modal. This is the single source of truth for modal open logic — individual components should NOT manually manipulate modal DOM state.

**Affected files:** `src/components/Footer.astro`, `src/components/Header.svelte`

**Affected agents:** Vidar (component ownership), any agent adding new subscribe triggers (just add `data-subscribe-modal` attribute)

**Issue:** #2

## Dual EmailOctopus Forms for Footer & Modal (2026-03-02)

**Author:** Vidar (Frontend Dev)  
**Status:** Implemented

The subscribe modal and footer both embedded the same EmailOctopus form, which broke EmailOctopus's AJAX submission handler (405 error on fallback GET). Use two separate forms:

- **Footer form ID:** `42f67d3a-13bd-11f1-b287-85e2229ceba6`
- **Modal form ID:** `775b1b8c-166d-11f1-8ddb-47be6204b8d8`

Added `modalFormId` as optional field in `SiteConfig.newsletter`. Both forms feed the same EmailOctopus list.

**Files changed:** `site/config.ts`, `src/components/Footer.astro`

## EmailOctopus Real Embed Script Integration (2026-03-02T20:07)

**Author:** Vidar (Frontend Dev)  
**Status:** Implemented

Use the **real EmailOctopus embed script** for both footer and modal subscribe forms. Do NOT use custom HTML forms with fetch POST.

**Key technical details:**

- Correct domain: `eocampaign1.com`, NOT `eomail5.com`
- Modal visibility: Use `visibility: hidden` + `pointer-events: none` + `opacity: 0` (NOT `display: none`)
- Script format: `<script async src="https://eocampaign1.com/form/{formId}.js" data-form="{formId}" />`

Previous custom form failed with `mode: 'no-cors'`. Display:none breaks EmailOctopus script initialization.

**Affected files:** `src/components/Footer.astro`

## Subscribe Modal: Custom Form Instead of Embed Script (v2) [SUPERSEDED]

**Author:** Vidar (Frontend Dev)  
**Date:** 2026-03-02  
**Status:** Superseded by "EmailOctopus Real Embed Script Integration"

This decision was replaced by the real embed script approach. Kept for historical record.
