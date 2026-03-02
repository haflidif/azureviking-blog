# Subscribe Modal: Custom Form Instead of Embed Script (v2)

**Date:** 2026-03-02
**Author:** Vidar (Frontend Dev)
**Status:** Implemented

## What

The subscribe overlay modal now uses a **custom HTML form with `fetch()` POST** instead of dynamically injecting the EmailOctopus embed script. The footer subscribe form is unchanged (still uses the static embed script).

## Why

The dynamic script injection approach (from commit 0c685d7) had two bugs:

1. **Form duplication:** EmailOctopus's embed script replaces its own `<script>` tag with rendered form HTML. The guard `!formContainer.querySelector('script')` passed on re-open because the script tag was gone, injecting a new form each time.
2. **405 Method Not Allowed:** The embed script's AJAX submit handler doesn't attach when the script is dynamically injected into a freshly-visible container. The form fell back to native GET submission, which EmailOctopus rejects.

## How

- The modal contains a static HTML form with `field_0` (email) and a honeypot field (`hpc_{formId}`).
- On submit, JavaScript uses `fetch()` with `method: 'POST'` and `mode: 'no-cors'` to post `FormData` to `https://eomail5.com/form/{formId}`.
- Success/error messages are shown inline. A loading spinner provides feedback during submission.
- No third-party script is loaded for the modal — eliminates all initialization timing issues.

## Affected files

- `src/components/Footer.astro` — modal HTML + form + submit handler + styles

## Affected agents

- **Vidar** — owns the modal component
- Any agent adding subscribe triggers — still use `data-subscribe-modal` attribute (unchanged)
