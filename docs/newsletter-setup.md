# Newsletter Automation Setup

This guide walks through setting up the EmailOctopus newsletter automation so that subscribers automatically receive an email when a new blog post is published.

## Architecture

```
Push to main → Deploy to GitHub Pages → Newsletter workflow triggers
                                            ↓
                                    Detect new .md files
                                            ↓
                                    Parse post frontmatter
                                            ↓
                              Batch-update contact fields
                              (LatestPostTitle, URL, Excerpt)
                                            ↓
                              Trigger automation per contact
                                            ↓
                            EmailOctopus sends branded email
```

## Prerequisites

- An [EmailOctopus](https://emailoctopus.com) account (free tier works)
- A subscriber list with contacts
- The subscribe form already configured (see `site/config.ts`)

---

## Step 1: Generate an API Key

1. Go to **EmailOctopus → Account Settings → [API Keys](https://emailoctopus.com/developer/api-keys)**
2. Click **Create API key**
3. Copy the key — you'll need it for GitHub Secrets

> **Note:** You need a v2 API key (not a legacy key). If your existing key is labelled "legacy", create a new one.

---

## Step 2: Find Your List ID

1. Go to **EmailOctopus → Lists**
2. Click on your subscriber list
3. The list ID is in the URL: `https://emailoctopus.com/lists/YOUR_LIST_ID`
4. Copy the UUID

---

## Step 3: Create Custom Fields

These fields store the latest post data on each contact so the email template can reference them.

1. Go to your **List → Settings → Fields**
2. Create three **Text** fields:
   - `LatestPostTitle` (tag: `LatestPostTitle`)
   - `LatestPostUrl` (tag: `LatestPostUrl`)
   - `LatestPostExcerpt` (tag: `LatestPostExcerpt`)

> **Important:** The field tags must match exactly — the script uses these as keys in the API.

---

## Step 4: Create the Automation

1. Go to **EmailOctopus → Automations → Create automation**
2. Select **"Start from scratch"**
3. Choose trigger: **"Started via API"**
4. Enable: **"Allow contacts to repeat"** (so the same subscriber can receive multiple post notifications)
5. Add action: **"Send email"**
6. Configure the email:
   - **Subject:** `New post: {{LatestPostTitle}}`
   - **From name:** `AzureViking` (or your preferred sender name)
   - **From email:** Your verified sender email
   - Click **"Code"** or **"HTML editor"** and paste the contents of [`docs/newsletter-template.html`](./newsletter-template.html)
7. Save and **activate** the automation
8. Copy the automation ID from the URL: `https://emailoctopus.com/automations/YOUR_AUTOMATION_ID`

---

## Step 5: Add GitHub Secrets

Go to your repository **Settings → Secrets and variables → Actions** and add:

| Secret Name                  | Value                            |
| ---------------------------- | -------------------------------- |
| `EMAILOCTOPUS_API_KEY`       | Your API v2 key from Step 1      |
| `EMAILOCTOPUS_LIST_ID`       | Your list UUID from Step 2       |
| `EMAILOCTOPUS_AUTOMATION_ID` | Your automation UUID from Step 4 |

---

## Step 6: Create the GitHub Environment

The workflow uses an environment with protection rules (manual approval before sending).

1. Go to **Settings → Environments → New environment**
2. Name it: `newsletter-send`
3. Enable **"Required reviewers"** and add yourself
4. This ensures you can preview the email before it actually sends

---

## Usage

### Automatic (on deploy)

The workflow triggers automatically after a successful GitHub Pages deploy. It:

1. Detects new `.md` files in `site/content/posts/`
2. Shows a preview in the GitHub Actions job summary
3. Waits for your approval (environment protection)
4. Sends the newsletter to all subscribers

### Manual trigger

Go to **Actions → Send Newsletter → Run workflow** and provide:

- `post_slug`: The slug of the post to send (e.g., `my-new-post`)

### Skipping a post

Add `newsletter_skip: true` to the post's frontmatter to skip newsletter delivery:

```yaml
---
title: 'My Post'
newsletter_skip: true
---
```

### Dry run

The preview job always runs in dry-run mode, showing what would be sent without making API calls.

---

## Troubleshooting

### "Resource not found" error

- Verify your list ID and automation ID are correct
- Ensure the automation is activated (not paused)

### "Access denied" error

- Your API key may be a legacy key — generate a new v2 key

### Rate limiting

- The script respects EmailOctopus's rate limit (10 req/s)
- For lists with 500+ contacts, the script processes in batches with delays

### Contacts not receiving email

- Check the automation is set to "Allow contacts to repeat"
- Verify contacts are in "subscribed" status
- Check the custom fields were updated (visible in the contact's profile)
