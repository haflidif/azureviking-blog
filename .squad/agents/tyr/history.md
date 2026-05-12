# Project Context

- **Owner:** Haflidi Fridthjofsson
- **Project:** AzureViking Blog — technical blog with posts, tutorials, and conference recaps
- **Stack:** Astro 5, Svelte 5, TypeScript, Tailwind CSS v4, pnpm
- **Hosting:** GitHub Pages at azureviking.com
- **Created:** 2026-03-02T15:24:14Z

## Learnings

### Squad on ACA Blog Post Structure (2026-04-16)

**What:** Proposed comprehensive structure for "Squad on ACA" blog post — 2,500-word journey narrative with technical depth.

**Key decisions:**

- Lead with journey and irony, not cost savings (source material explicitly requested this angle)
- Four struggles (GitHub App licensing, identity auth, KEDA escape hatch, Bodhi retirement) — cut the other four for focus
- Bodhi's "layoff" story positioned as final struggle (creates emotional arc: technical problems → team evolution)
- Blend narrative and technical detail — struggles ARE the story
- One post, not a series (coherent arc, meta-moment needs full context)
- Cost comparison in Section 5, not opening (validates approach, doesn't define it)
- Single code snippet (KEDA identity auth) — enough to show technical depth without overwhelming

**Structure:**

1. The Spark (300w) — origin question, irony, timeline
2. What It Does (400w) — UX + architecture flow + `/squad revise` loop
3. The Struggles (1,000w) — heart of post, four struggles with narrative arcs
4. What Makes This Work (350w) — celebrate the elegance
5. What It Costs (150w) — validation numbers
6. The Potential (300w) — forward-looking, Haflidi signature energy
7. Try It Yourself (100w) — repo link, brief invitation

**Recommended title:** "I Built a Serverless AI Agent Platform in 3 Days (Squad Agents Built Squad Agents)"

**Why this matters:** Demonstrates how to structure technical blog posts that feel like human storytelling — senior architect over coffee, not a tutorial or reference manual. The plan includes word count budgets, tone enforcement checklist, visual asset specs, and content cuts from 677-line source material. Ready for Bragi to execute.

<!-- Append new learnings below. Each entry is something lasting about the project. -->

## Session: Squad ACA Blog Post (2026-04-17T08:11:44.9637043Z)

- Participated in multi-agent blog content creation
- Delivered on all assigned tasks
- Coordinated with Tyr (planning), Bragi (content), Idunn (visuals)
- Post ready for review at site/content/posts/squad-on-aca-serverless-ai-agents.md

## Cross-Agent Heads-Up: About Page Rewrite Proposal (2026-05-12)

**From Scribe:** FYI — Bragi delivered a comprehensive about-page rewrite proposal that shifts from CV chronology to value-first structure. This is a team-visible proposal awaiting Haflidi's approval before implementation.

**What changed:** From chronological autobiography (age 4 computers, 2018 Norway move, career progression) to reader-centric framing (value hook → expertise intersection → credentials → community → personal).

**Status:** Proposed, awaiting Haflidi's answers to 3 open questions:

1. Hook framing: "secure by design" vs broader angle?
2. Community details: Any podcasts/conferences/presence not yet mentioned?
3. Personal flavor: Caffeinated joke vs family/cultural note?

**Where to find:** `.squad/decisions.md` (search for "About Page Structure Shift"). Full context also in `.squad/orchestration-log/2026-05-12T10-52-57Z-bragi.md` and session log at `.squad/log/2026-05-12T10-52-57Z-about-page-rewrite-proposal.md`.
