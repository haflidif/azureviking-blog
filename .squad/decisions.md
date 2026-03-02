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
