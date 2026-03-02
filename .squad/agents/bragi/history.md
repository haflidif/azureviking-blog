# Project Context

- **Owner:** Haflidi Fridthjofsson
- **Project:** AzureViking Blog — technical blog with posts, tutorials, and conference recaps
- **Stack:** Astro 5, Svelte 5, TypeScript, Tailwind CSS v4, pnpm
- **Hosting:** GitHub Pages at azureviking.com
- **Created:** 2026-03-02T15:24:14Z

## Key References

- `.github/copilot/agents/blog-writer.md` — authoritative writing style guide with full voice analysis
- `site/content/posts/` — blog post markdown files
- `site/assets/images/posts/{slug}/` — post-specific images

## Learnings

- **Blog posts live in `site/content/posts/` not `src/content/posts/`** — the directory structure is under `site/`, not `src/`. Images go in `site/assets/images/posts/{slug}/`.
- **Haflidi's voice: conversational, short sentences, genuine energy.** Uses contractions naturally. Median sentence is ~8 words. Exclamation marks are frequent and natural. Opens with personal context or a story, never generic hooks. Vulnerability and honesty are authentic (e.g., "I will not lie...").
- **No dashes between words.** Avoid em dash (—), en dash (–), double hyphen (--). Rephrase instead.
- **No AI filler.** Words like "certainly", "moreover", "furthermore", "indeed", "arguably", "notably" should never appear.
- **Bold for key concepts on first mention.** Helps readers scan and understand at a glance.
- **Emoji only at the very end as a sign-off.** One emoji is enough; it's a signature, not decoration.
- **Gratitude is baked in.** Haflidi thanks people, tools, and communities constantly. It's authentic, not performative.
- **Forward-looking closings work best.** End with what's next or what you're excited about, not a generic summary.
- **Frontmatter requires `draft: true` at creation, `draft: false` when published.** Other fields: `title`, `slug`, `description`, `pubDate` (YYYY-MM-DD), `tags` (array), `category` (one of: blog, talk, tutorial, lab, news, podcast), `featured` (boolean), `coverImage` (path to `/images/posts/{slug}/cover.png`).

## Cross-Agent Updates (2026-03-02T15:38)

**Content path decision:** All content work targets `site/content/posts/` per team decision in `.squad/decisions.md`. Vidar, Heimdall, and Idunn have been notified.
