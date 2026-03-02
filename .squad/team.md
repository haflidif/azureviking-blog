# AzureViking Blog

> Technical blog built with Astro 5 + Svelte 5, styled with Tailwind CSS v4, hosted on GitHub Pages at azureviking.com.

## Coordinator

| Name  | Role        | Notes                                                                                  |
| ----- | ----------- | -------------------------------------------------------------------------------------- |
| Squad | Coordinator | Routes work, enforces handoffs and reviewer gates. Does not generate domain artifacts. |

## Members

| Name     | Role             | Charter                             | Status     |
| -------- | ---------------- | ----------------------------------- | ---------- |
| Tyr      | Lead             | `.squad/agents/tyr/charter.md`      | ✅ Active  |
| Bragi    | Content Dev      | `.squad/agents/bragi/charter.md`    | ✅ Active  |
| Vidar    | Frontend Dev     | `.squad/agents/vidar/charter.md`    | ✅ Active  |
| Heimdall | Automation Dev   | `.squad/agents/heimdall/charter.md` | ✅ Active  |
| Idunn    | Image Specialist | `.squad/agents/idunn/charter.md`    | ✅ Active  |
| Scribe   | Session Logger   | `.squad/agents/scribe/charter.md`   | 📋 Silent  |
| Ralph    | Work Monitor     | —                                   | 🔄 Monitor |

## Coding Agent

<!-- copilot-auto-assign: true -->

| Name     | Role         | Charter | Status          |
| -------- | ------------ | ------- | --------------- |
| @copilot | Coding Agent | —       | 🤖 Coding Agent |

### Capabilities

**🟢 Good fit — auto-route when enabled:**

- Bug fixes with clear reproduction steps
- Test coverage (adding missing tests, fixing flaky tests)
- Lint/format fixes and code style cleanup
- Dependency updates and version bumps
- Small isolated features with clear specs
- Boilerplate/scaffolding generation
- Documentation fixes and README updates

**🟡 Needs review — route to @copilot but flag for squad member PR review:**

- Medium features with clear specs and acceptance criteria
- Refactoring with existing test coverage
- API endpoint additions following established patterns

**🔴 Not suitable — route to squad member instead:**

- Architecture decisions and system design
- Multi-system integration requiring coordination
- Ambiguous requirements needing clarification
- Security-critical changes (auth, encryption, access control)
- Performance-critical paths requiring benchmarking
- Changes requiring cross-team discussion

## Issue Source

- **Repository:** haflidif/azureviking-blog
- **Connected:** 2026-03-02T15:24:14Z
- **Filters:** All open issues

## Project Context

- **Owner:** Haflidi Fridthjofsson
- **Stack:** Astro 5, Svelte 5, TypeScript, Tailwind CSS v4, pnpm
- **Description:** Technical blog with posts, tutorials, and conference recaps, hosted on GitHub Pages at azureviking.com
- **Created:** 2026-03-02T15:24:14Z
