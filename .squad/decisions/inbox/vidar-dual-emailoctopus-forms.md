# Decision: Dual EmailOctopus Forms for Footer & Modal

**Date:** 2026-03-02
**Author:** Vidar (Frontend Dev)
**Status:** Implemented

## Context

The subscribe modal and footer both embedded the same EmailOctopus form (`42f67d3a-13bd-11f1-b287-85e2229ceba6`). Having the same embed script loaded twice on one page breaks EmailOctopus's AJAX submission handler. The result: the form falls back to a native GET request, which returns a 405 Method Not Allowed error.

## Decision

Use two separate EmailOctopus forms — one for the footer, one for the modal:

- **Footer form ID:** `42f67d3a-13bd-11f1-b287-85e2229ceba6` (unchanged)
- **Modal form ID:** `775b1b8c-166d-11f1-8ddb-47be6204b8d8` (new)

Added `modalFormId` as an optional field in `SiteConfig.newsletter`. The modal in `Footer.astro` now references `SITE.newsletter.modalFormId` with a fallback to `formId`.

## Files Changed

- `site/config.ts` — Added `modalFormId` to type and config
- `src/components/Footer.astro` — Modal uses `modalFormId || formId`

## Rationale

This is the approach recommended by EmailOctopus: each embed on a page needs its own form ID so the scripts don't collide. Both forms feed into the same EmailOctopus list, so subscribers end up in the same place regardless of which form they use.
