# EmailOctopus Real Embed Script Integration

**Date:** 2026-03-02T20:07  
**Agent:** Vidar (Frontend Dev)  
**Issue:** Custom form silently failed subscriptions; wrong domain

## Decision

Use the **real EmailOctopus embed script** for both footer and modal subscribe forms. Do NOT use custom HTML forms with fetch POST.

## Key Technical Details

1. **Correct domain:** `eocampaign1.com`, NOT `eomail5.com`
2. **Modal visibility approach:** Use `visibility: hidden` + `pointer-events: none` + `opacity: 0` instead of `display: none`. This allows the EmailOctopus script to initialize while the modal is hidden.
3. **Script format:**
   ```html
   <script async src="https://eocampaign1.com/form/{formId}.js" data-form="{formId}" />
   ```

## Why

- **Previous custom form failed:** Used `mode: 'no-cors'` which gave opaque responses. Users thought they subscribed, but nothing hit EmailOctopus.
- **Display:none breaks embed script:** EmailOctopus scripts can't attach AJAX handlers to elements that are `display: none` at init time. Visibility approach solves this.
- **Styling consistency:** Real embed form matches footer form styling with CSS overrides.

## Affected Files

- `src/components/Footer.astro` — both footer and modal forms

## Affected Agents

Vidar owns this component. Any future newsletter/form work should reference this decision.
