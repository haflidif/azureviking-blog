# Work Routing

How to decide who handles what.

## Routing Table

| Work Type               | Route To | Examples                                                         |
| ----------------------- | -------- | ---------------------------------------------------------------- |
| Architecture & scope    | Tyr      | Project structure, feature prioritization, trade-offs            |
| Code review             | Tyr      | Review PRs, check quality, approve changes                       |
| Blog content & writing  | Bragi    | Blog posts, tutorials, markdown content, voice & style           |
| UI components & styling | Vidar    | Svelte 5 components, Tailwind CSS, layouts, responsive design    |
| Publishing automation   | Heimdall | Newsletter (EmailOctopus), LinkedIn auto-posting, GitHub Actions |
| Image processing        | Idunn    | Cover images, optimization, resizing, image pipelines            |
| Session logging         | Scribe   | Automatic — never needs routing                                  |

## Issue Routing

| Label            | Action                                               | Who         |
| ---------------- | ---------------------------------------------------- | ----------- |
| `squad`          | Triage: analyze issue, assign `squad:{member}` label | Tyr         |
| `squad:tyr`      | Architecture, review, scoping work                   | Tyr         |
| `squad:bragi`    | Content writing tasks                                | Bragi       |
| `squad:vidar`    | UI/component tasks                                   | Vidar       |
| `squad:heimdall` | Automation tasks                                     | Heimdall    |
| `squad:idunn`    | Image processing tasks                               | Idunn       |
| `squad:copilot`  | Assign to @copilot for autonomous work               | @copilot 🤖 |

## Rules

1. **Eager by default** — spawn all agents who could usefully start work, including anticipatory downstream work.
2. **Scribe always runs** after substantial work, always as `mode: "background"`. Never blocks.
3. **Quick facts → coordinator answers directly.** Don't spawn an agent for "what port does the server run on?"
4. **When two agents could handle it**, pick the one whose domain is the primary concern.
5. **"Team, ..." → fan-out.** Spawn all relevant agents in parallel as `mode: "background"`.
6. **Anticipate downstream work.** If a feature is being built, spawn the tester to write test cases from requirements simultaneously.
7. **Issue-labeled work** — when a `squad:{member}` label is applied to an issue, route to that member. Tyr handles all `squad` (base label) triage.
