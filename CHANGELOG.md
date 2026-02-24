# Changelog

All notable changes to the AzureViking blog are documented here.

## 2026-02-24

### Added

- Automated LinkedIn posting when new blog posts are published
- Personalized post templates with category-aware intros (review, module, technical, personal)
- Dry-run mode for previewing LinkedIn posts locally
- LinkedIn OAuth helper script for token setup

### Fixed

- OG image URLs missing base path — social previews now display correctly on LinkedIn/Twitter
- Post route renamed from `/posts/` to `/post/` to match WordPress URLs for SEO preservation

## 2026-02-23

### Added

- Per-post view counter using Cloudflare Workers + KV
- View count deduplication via localStorage (no inflating on refresh)
- Migrated WordPress view counts to Cloudflare KV for all 12 posts
- Post slugs matched to original WordPress URLs via frontmatter

## 2026-02-22

### Added

- Migrated 12 blog posts from WordPress to Astro/Markdown
- Custom homepage with featured carousel, latest posts grid, and hero section
- Social links (GitHub, LinkedIn, YouTube, Instagram, Meetup, Sessionize)
- Dark/light mode with system preference detection
- About page with profile photo and bio
- Speaking appearances section
- Tag-based post filtering
- RSS feed and sitemap
- Footer with theme credit, social icons, and disclaimer

### Changed

- Deployed to GitHub Pages (from WordPress/Hostinger)
- Built on Spaceship theme by alec-c4, customized extensively
