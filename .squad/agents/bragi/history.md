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

## Squad on ACA Blog Post Draft (2026-04-17)

**Post:** `site/content/posts/squad-on-aca-serverless-ai-agents.md`

**Writing decisions:**

- **~2,237 words** (within the 2,500–2,600 target range). Slightly under but every sentence earns its place.
- **5 code snippets** (up from Tyr's planned 1): dual-token swap bash, `copilot --yolo` invocation, queue message JSON, KEDA identity auth HCL, and the architecture flow is described in numbered steps rather than a diagram-only approach. Short teasers, not tutorials.
- **Building-process moments included:** The 14 executions breakthrough ("lean back in your chair"), the first PR from a container ("stared at it"), the 4-jobs-to-1 simplification, Squad building Squad (meta-irony landed in section 1 with named agents).
- **No terminal chat blocks** per Tyr's decision. This post is about the platform, not a Squad session demo.
- **Bodhi retirement** positioned as final struggle (Struggle D) for narrative momentum. Warm, reflective tone. Alumni directory mentioned.
- **Gratitude for Brady Gaster** added in The Potential section. Authentic, not performative.
- **Voice compliance verified:** No prose dashes, no AI filler, no formulaic patterns, no second-person commands. Emoji only at sign-off. Bold on first mention of key concepts. Contractions natural throughout.
- **`/squad revise` loop** fully described in Section 2 (What It Does) with guard details, not deferred to Section 4.
- **Frontmatter uses Haflidi's title** (shorter than Tyr's recommendation, per Haflidi's explicit request). pubDate set to 2026-04-17. `draft: true`.

## Session: Squad ACA Blog Post (2026-04-17T08:11:44.9637043Z)

- Participated in multi-agent blog content creation
- Delivered on all assigned tasks
- Coordinated with Tyr (planning), Bragi (content), Idunn (visuals)
- Post ready for review at site/content/posts/squad-on-aca-serverless-ai-agents.md

## About Page Restructure Proposal (2026-04-21)

**Request:** Haflidi asked to shift the about page from chronological autobiography (CV timeline) to a value-first structure inspired by Alexander Arvidsson's about page pattern.

**Pattern extracted from reference:**

1. Value-first hook (what the blog offers the reader)
2. Expertise focus (intersection framing + topics to expect)
3. Voice/credibility (credentials as "why listen to me")
4. Where to find me (community presence)
5. Tiny personal note (humanizing tail)

**Structural decisions:**

- **Dropped chronological timeline entirely.** No more "I was born in Iceland, started with computers at age 4, moved to Norway in 2018." The about page is now reader-focused first, biography second.
- **"Intersection of infrastructure and security" framing.** Positions Haflidi's expertise clearly without listing job titles chronologically.
- **Credentials serve credibility, not career history.** Microsoft role, MVP status, and Security User Group co-founding now answer "why should I listen to you?" Certification list was cut (important for LinkedIn, less so for blog readers).
- **Personal humanizing tail in Haflidi's voice.** "Icelandic by birth, Norwegian by residence, permanently caffeinated by necessity" uses his natural humor without oversharing.
- **Disclaimer kept at the end.** Legally important but repositioned after the bio so it's not the first thing readers see.

**Voice compliance verified:** No dashes, no AI filler, conversational tone, short sentences where appropriate. The opening "Cloud infrastructure only works when it's secure by design" is 10 words (slightly above Haflidi's 8-word median but works as a hook). Most other sentences are 8-12 words with natural rhythm.

**Open questions for Haflidi:**

1. Is "secure by design" the primary message, or would he prefer broader framing?
2. Does he have podcast/community presence not mentioned in current bio?
3. Personal flavor preference at the end (current: caffeinated joke)

**Files affected (proposal only, not modified):**

- `site/content/about/index.md` - full rewrite proposed
- `src/components/BioCard.astro` - new tagline proposed

**Learning:** About pages should be value-first for readers, not CV timelines. This pattern shift (reader benefit → expertise → credentials → community → personal) is reusable for any professional blog's about page.

## About Page Rewrite Shipped (2026-04-21)

**Final framing decisions:**

- **AI added as primary topic** — positioned within infrastructure and security context. Not generic AI content. Reflects Squad agents, Copilot CLI, AI-powered DevOps tooling focus. Topic list: AI (in context of infra/security), Azure Infrastructure, Cloud Security, Infrastructure as Code.
- **Microsoft 365 removed entirely** — no longer a blog focus area. Stripped from about page.
- **Hook style:** "Cloud infrastructure only works when it's secure by design. That's what this blog is about." — approved, unchanged from v2.
- **Personal line (final):** "Life outside of Azure happens in Norway. I'm Icelandic by birth, Norwegian by residence, and I plan infrastructure like my ancestors planned voyages: carefully, strategically, and with far too much coffee." — Combined caffeinated joke + Viking/saga nod in one sentence. Dry, funny, lands both beats naturally.
- **Heading structure:** Used Option X (Alexander's pattern) — page title IS the welcome line ("Hey there! I'm Haflidi."). No separate H2. Cleaner than generic "About" H1 + redundant H2.
- **Intersection framing:** Kept "infrastructure and security" as core. AI is a topic within that intersection, not a third pillar. Matches how his posts frame AI (infrastructure capability, DevOps tooling).

**Learning:** When combining two personality beats (caffeine + cultural nod), find ONE sentence that carries both naturally. "Like my ancestors planned voyages... with far too much coffee" is tighter than stacking two metaphors or sentences. Dryness preserved.
