# Decisions

> Team decisions that affect everyone. Append-only. Managed by Scribe.

<!-- New decisions are appended below by Scribe after merging from decisions/inbox/ -->

## Content Path Convention (2026-03-02T15:38)

**What:** Blog posts and content files live in `site/content/posts/`, NOT `src/content/posts/`.

**Why:** The AzureViking Blog uses a `site/` directory structure for content and assets. The custom instructions incorrectly reference `src/content/posts/` but the authoritative path is `site/content/posts/`.

**Images:** Post-specific images go in `site/assets/images/posts/{slug}/`.

**Affected agents:** Bragi (content creation), Vidar (component/layout work), Heimdall (deployment), Idunn (asset management).

**Confirmed by:** Haflidi Fridthjofsson (via test blog post review).
