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
- **Collaborative image contracts work well for parallel workflows.** Image specialist (Idunn) can create assets in parallel while I write the post. Document the shared contract upfront: image filenames, locations, and a list of where each will be referenced. This allows both agents to work independently without blocking. The post writer references all images by path; the image specialist delivers to those exact paths.

## Cross-Agent Updates (2026-03-02T15:38)

**Content path decision:** All content work targets `site/content/posts/` per team decision in `.squad/decisions.md`. Vidar, Heimdall, and Idunn have been notified.

## Collaboration Validation (2026-03-02T16:32)

**Bragi+Idunn parallel test:** Successfully executed conference summary post + 4 image set in parallel. Bragi wrote post with forward image references; Idunn created images to matching specs (1200x630, palette-consistent, 24–53 KB). No blocking dependencies. Test confirmed that collaborative contract works when documented clearly upfront. Key insight: image specialist can deliver quality assets in parallel if contract (filenames, dimensions, count) is locked before content creation starts.

## Editorial Review: Part 2 Copilot CLI Post (2026-03-18)

**Post:** `site/content/posts/github-copilot-cli-more-than-just-code-part-2.md`

**Review result:** Post is publication-ready after minor polish edits.

**What was clean:**

- No AI filler words, no forbidden dashes in prose, no formulaic intros/closings, no stiff transitions, no passive voice
- Terminal chat blocks (3 total) all match the `terminal-chat` skill spec exactly
- `copilot-thinking` blocks (4 total) are properly styled via `src/styles/global.css` — a new component introduced in Part 2
- Bold on first mention of all key concepts (ffmpeg, Playwright, Pillow, numpy, ZoomIt, etc.)
- Emoji only at sign-off (🛠️), matching Part 1
- "I will not lie..." Haflidi-ism present
- Frontmatter valid, slug matches filename, series metadata matches Part 1

**What I polished:**

- Gratitude paragraph: "Shout-out to" → "Huge thanks to" + added Copilot connection ("Copilot made them feel like they were built into my terminal") for warmer voice consistency with Part 1
- "Your Turn" invitation: Broadened from video-specific ("compress a video or trim a clip") to creative-task-general ("Got a creative task that feels like it needs a GUI?") to match Part 1's broader invitation style
- Part 3 teaser: Added "I cannot wait to share that one" for more energy/excitement, consistent with Part 1's forward-looking warmth

**Pattern noted:** Image folder naming in this series uses descriptive names (e.g., `github-copilot-cli-video-editing`) rather than matching the slug (`github-copilot-cli-more-than-just-code-part-2`). Both Part 1 and Part 2 follow this pattern. This is the established convention for this series.

**Key skill reference:** `.github/skills/terminal-chat/SKILL.md` defines terminal chat HTML structure. `copilot-thinking` is a separate component styled in `src/styles/global.css` — not part of the terminal-chat skill but used alongside it in Copilot CLI posts.
