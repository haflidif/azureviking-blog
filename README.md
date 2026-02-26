# AzureViking Blog 🛡️

Personal tech blog by **Haflidi Fridthjofsson** — Senior Cloud Solution Architect at Microsoft. Sharing deep dives on Azure infrastructure, identity, security, FIDO2 authentication, and cloud networking.

🔗 **Live site**: [azureviking.com](https://azureviking.com/)

## Tech Stack

- **Framework**: [Astro 5](https://astro.build/) with [Svelte 5](https://svelte.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Theme**: Built on the [Spaceship](https://github.com/alec-c4/spaceship) theme by [alec-c4](https://github.com/alec-c4)
- **Hosting**: [GitHub Pages](https://pages.github.com/)
- **Analytics**: [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/)
- **View Counter**: Cloudflare Workers + KV
- **Social Automation**: LinkedIn auto-posting via GitHub Actions

## Features

- 📝 Markdown blog with syntax highlighting, TOC, and Mermaid diagrams
- 🔍 Client-side search across all posts
- 👁️ Per-post view counter (Cloudflare Workers + KV)
- 📣 Automated LinkedIn posting when new posts are published
- 📊 Dynamic OG images for social sharing
- 🌗 Dark/light mode with system preference detection
- 📱 Fully responsive design
- 🏷️ Tag-based filtering and categorization
- 📡 RSS feed at `/rss.xml`

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint & type check
pnpm lint
pnpm check
```

## Project Structure

```
├── site/                  # Content & configuration
│   ├── assets/            # Static files (images, favicon)
│   ├── content/
│   │   ├── posts/         # Blog posts (Markdown)
│   │   ├── appearances/   # Speaking engagements
│   │   └── about/         # About page content
│   ├── config.ts          # Site configuration
│   └── hero.md            # Homepage hero content
├── src/                   # Application code
│   ├── components/        # Svelte & Astro components
│   ├── layouts/           # Page layouts
│   ├── lib/               # Utilities & schemas
│   └── pages/             # File-based routing
├── .github/
│   ├── workflows/         # CI, deploy, LinkedIn posting
│   └── scripts/           # LinkedIn automation scripts
└── dist/                  # Built output (GitHub Pages)
```

## Deployment

Pushes to `master` automatically deploy via GitHub Actions:

1. **CI** (`ci.yml`) — Lint, format, type check, build
2. **Deploy** (`deploy.yml`) — Build and deploy to GitHub Pages
3. **LinkedIn** (`linkedin-post.yml`) — Auto-share new posts on LinkedIn

## Writing a New Post

1. Create a new `.md` file in `site/content/posts/`
2. Add frontmatter (title, description, pubDate, tags, coverImage)
3. Optionally add `slug:` to customize the URL
4. Optionally add `social_text:` for a custom LinkedIn post
5. Commit and push — the site deploys and LinkedIn post is created automatically

## License

Blog content © Haflidi Fridthjofsson. All rights reserved.

Theme engine ([Spaceship](https://github.com/alec-c4/spaceship)) is MIT licensed by [Alexey Poimtsev](https://github.com/alec-c4).
