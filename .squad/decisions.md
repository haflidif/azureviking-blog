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

# Decision: Squad on ACA Blog Post Draft Structure

**Author:** Bragi (Content Dev)
**Date:** 2026-04-17
**Status:** Draft for review

## What

Blog post `site/content/posts/squad-on-aca-serverless-ai-agents.md` uses 5 code snippets (dual-token swap, copilot invocation, queue JSON, KEDA HCL, and copilot --yolo one-liner) rather than Tyr's planned single snippet. Each snippet is kept to 5-10 lines as teasers, not tutorials.

## Why

Haflidi explicitly requested more code teasers to help readers "feel the building process." The snippets are chosen to tell a story: the auth dance, the trigger mechanism, the infrastructure escape hatch, and the magic invocation moment. They complement the narrative rather than interrupting it.

## Affected agents

Idunn (image specialist) needs to create `cover.png` and `architecture-flow.png` at the paths referenced in the post. Tyr (lead) should review the expanded scope against the original plan.

# Squad on ACA Blog Post Structure

**Author:** Tyr (Lead)  
**Date:** 2026-04-16  
**Status:** Proposed for Bragi execution

## Context

Haflidi requested a blog post structure plan for the "Squad on ACA" project — a serverless AI agent platform built in 3 days using Azure Container Apps, KEDA, and GitHub Copilot CLI. Source material is 677 lines of raw technical content compiled by Wedge (Lead Agent from squad-on-aca project). Target: 2,500-word blog post.

**Key constraint from source material:** "The angle: The journey and discovery — NOT cost savings as the primary hook."

## Decision

Structure the post as a **journey narrative with embedded technical depth** — 7 sections totaling 2,500 words.

### Title (Recommended)

"I Built a Serverless AI Agent Platform in 3 Days (Squad Agents Built Squad Agents)"

**Why:** Captures the timeline, the outcome, and the meta-irony in one sentence. Personal ("I built"), clear value prop (serverless AI platform), hooks with paradox (agents building their own infrastructure).

### Core Structure

1. **The Spark** (300w) — Origin question ("Does Squad work on ACA?"), why it mattered, 3-day timeline, irony reveal
2. **What It Does** (400w) — User journey (label → PR → revise → merge), architecture flow, `/squad revise` loop
3. **The Struggles** (1,000w) — Four struggles with narrative arcs:
   - GitHub App licensing gap (dual-token pattern)
   - Identity-based auth everywhere (subscription policy forcing quality)
   - KEDA escape hatch (AVM → azurerm → azapi, 14-execution breakthrough)
   - Bodhi gets laid off (Function App → GitHub Actions simplification, team evolution)
4. **What Makes This Work** (350w) — Scale to zero, ephemeral isolation, .squad/ memory, GitHub-native UX
5. **What It Costs** (150w) — $6/mo vs $72/mo AKS, but NOT leading with cost
6. **The Potential** (300w) — Better GitHub integration, fan-out, event sources, community, forward energy
7. **Try It Yourself** (100w) — Repo link, brief invitation

### Key Content Cuts

From 677 lines of source, **excluded**:

- Detailed .squad/ directory tree (keep concept, skip file listing)
- Full agent roster table (mention, don't enumerate)
- Technical reference tables (belongs in docs, not narrative)
- 4 of 8 struggles (kept the ones with narrative arcs and emotional hooks)
- Prerequisites list, Azure services rationale table, timeline table

**Why:** Blog is experience report with technical precision, not reference documentation. Readers should feel like Haflidi is explaining over coffee, not writing a manual.

### Structural Choices

**Journey vs Cost:**  
Cost appears in Section 5 (word 1,950+), not opening. Leading with "$6 vs $72" frames this as cost optimization. Leading with "I asked a question and built it in 3 days" frames it as innovation + speed. Cost validates; it doesn't define.

**Four Struggles, Not Eight:**  
The four chosen have:

- Technical substance (not just "solved with flag X")
- Narrative arcs (problem → iteration → breakthrough or consequence)
- Emotional hooks (frustration, revelation, philosophical moment)

Cut struggles are "interesting problems solved" but lack dramatic payoff.

**Bodhi's Position:**  
Bodhi retirement is the **final struggle** (not a separate section). Creates momentum: technical problems → platform limits → tooling gaps → team evolution. Ends struggles on a human note before pivoting to "what works well."

**One Post, Not Series:**  
The meta-moment (Squad agents building Squad platform) needs full context. Splitting would fragment the irony and dilute impact.

## Affected Files

- Session plan: `C:\Users\haflidif\.copilot\session-state\{session-id}\plan.md` (comprehensive structure for Bragi)
- `.squad/agents/tyr/history.md` (learnings appended)
- This decision record

## Consequences

**Positive:**

- Bragi has clear roadmap with word counts, tone enforcement, content mapping, and visual specs
- Structure balances narrative flow with technical depth — matches Haflidi's voice
- Content cuts keep post focused (2,500w target achievable)
- Bodhi story provides human/philosophical angle that elevates beyond pure tech

**Tradeoffs:**

- Some readers may want more technical detail (reference them to repo docs)
- Cutting 4 struggles means some problem-solving context is lost (acceptable for narrative coherence)

## Next Steps

1. Bragi writes post following plan + `.github/copilot/agents/blog-writer.md` voice guide
2. Idunn creates two images (cover + architecture diagram, 1200×630 each)
3. Tyr reviews for technical accuracy before publish

# Decision: About Page Structure Shift (CV Timeline → Value-First)

**Author:** Bragi (Content Dev)  
**Date:** 2026-04-21  
**Status:** Proposed (awaiting Haflidi approval)

## What

Restructure `site/content/about/index.md` from chronological autobiography (birth → education → career progression) to value-first pattern (reader benefit → expertise → credentials → community → personal).

## Why

The current about page starts with "My name is Haflidi Fridthjofsson, an Icelandic Technical Fellow..." and proceeds chronologically through his life story. This is CV-style framing. Blog readers don't arrive asking "where was Haflidi employed in 2018?" They arrive asking "what can I learn here?" or "why should I trust this person's advice?"

Alexander Arvidsson's about page (reference provided by Haflidi) demonstrates the pattern:

- Opens with value prop: "Data only inspires change when it matters to your audience"
- Frames expertise: "The intersection of people and information"
- Presents credentials in service of credibility, not timeline
- Shows community presence (conferences, user groups, podcasts)
- Ends with personal humanizing note (location, family, hobbies)

Haflidi's expertise sits at the **intersection of infrastructure and security** — this framing immediately positions what the blog covers and why his perspective is unique.

## How (Proposed Changes)

### Structure

**OLD (chronological):**

1. Name + current role + credentials
2. Started with computers at age 4
3. Career progression (2018 Norway move → Avanade → Sopra Steria → Microsoft)
4. Certifications list
5. Community contributions
6. Disclaimer

**NEW (value-first):**

1. Hook: "Cloud infrastructure only works when it's secure by design. That's what this blog is about."
2. Expertise framing: "The intersection of infrastructure and security" + topics to expect
3. Credentials: Microsoft role, MVP status, Security User Group, OSS contributions
4. Community presence: blog, speaking, open-source
5. Personal humanizing note: "Icelandic by birth, Norwegian by residence, permanently caffeinated by necessity"
6. Disclaimer (repositioned to end)

### Content Cuts

- Full chronological timeline (age 4 computers story, 2018 Norway move arc, Avanade → Sopra Steria progression)
- Certification list (Cybersecurity Architect Expert, Solutions Architect Expert, etc. — these are LinkedIn material, not blog bio material)
- Detailed job role descriptions

### Content Additions

- Opening value statement for readers
- "Intersection of infrastructure and security" positioning
- Lighter, warmer personal note at the end

### BioCard Tagline Change

**OLD:**  
"Icelandic Technical Fellow & Senior Cloud Solution Architect at Microsoft. Former Microsoft MVP in Azure & Security."

**NEW (proposed):**  
"I help organizations build secure cloud platforms. Senior Cloud Solution Architect at Microsoft, Former Microsoft MVP in Azure & Security."

**Why:** The old tagline is credentials-first. The new tagline is value-first ("I help...") then credentials. Matches the about page shift.

## Voice Compliance

- No dashes, no AI filler, conversational tone verified
- Short sentences where appropriate (hook is 10 words, most others 8-12)
- Natural Haflidi rhythm and humor ("permanently caffeinated by necessity")
- No formulaic patterns, no passive voice

## Open Questions

1. **Hook framing:** Does "Cloud infrastructure only works when it's secure by design" position the blog correctly, or would Haflidi prefer broader framing (e.g., "simple, secure, and reliable")?
2. **Community details:** Is there a podcast, conference series, or other community presence not in the current bio that should be highlighted?
3. **Personal flavor:** Current proposal ends with caffeinated joke. Would Haflidi prefer family mention, hobby detail, or Iceland/Norway cultural note instead?

## Affected Files

- `site/content/about/index.md` — full markdown body rewrite
- `src/components/BioCard.astro` — tagline update (lines 36-37)

## Next Steps

1. Haflidi reviews proposal
2. Answer open questions (hook framing, community details, personal note preference)
3. Bragi implements approved version
4. Vidar updates BioCard component if tagline is approved

## Learning for Future About Pages

This pattern (value-first → expertise intersection → credentials → community → personal) is reusable for any professional blog. The shift from "here's my career timeline" to "here's what you'll learn and why I'm qualified to teach it" makes the about page serve readers instead of serving as a resume.
