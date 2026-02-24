#!/usr/bin/env node
/**
 * LinkedIn Auto-Post Script
 *
 * Detects new blog posts and shares them on LinkedIn.
 * Called by the linkedin-post.yml GitHub Actions workflow.
 *
 * Environment variables:
 *   LINKEDIN_ACCESS_TOKEN  - OAuth2 access token
 *   LINKEDIN_PERSON_URN    - LinkedIn person URN (urn:li:person:xxx)
 *   SITE_URL               - Blog base URL (e.g., https://haflidif.github.io/azureviking-blog)
 *   POST_SLUG              - (optional) Specific post slug to share
 *   CUSTOM_TEXT             - (optional) Custom LinkedIn post text
 */

import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

const LINKEDIN_API = 'https://api.linkedin.com/v2/ugcPosts';
const POSTS_DIR = 'site/content/posts';

// Parse YAML frontmatter from a markdown file
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const fm = {};
  const lines = match[1].split('\n');
  let currentKey = null;
  let inArray = false;
  let arrayValues = [];

  for (const line of lines) {
    // Array item
    if (inArray && line.match(/^\s+-\s+/)) {
      arrayValues.push(line.replace(/^\s+-\s+/, '').replace(/['"]/g, ''));
      continue;
    }

    // End of array
    if (inArray && !line.match(/^\s+-\s+/)) {
      fm[currentKey] = arrayValues;
      inArray = false;
      arrayValues = [];
    }

    // Key-value pair
    const kvMatch = line.match(/^(\w[\w_]*)\s*:\s*(.*)/);
    if (kvMatch) {
      const [, key, value] = kvMatch;
      if (value.trim() === '') {
        // Might be start of array or empty value
        currentKey = key;
        // Peek: if next items are array items, handle in next iteration
        inArray = true;
        arrayValues = [];
      } else {
        fm[key] = value
          .trim()
          .replace(/^['"]/, '')
          .replace(/['"]$/, '');
      }
    }
  }

  if (inArray && arrayValues.length > 0) {
    fm[currentKey] = arrayValues;
  }

  return fm;
}

// Detect new posts via git diff
function detectNewPosts() {
  try {
    const diff = execSync(
      `git diff --name-only --diff-filter=A HEAD~1 HEAD -- "${POSTS_DIR}/*.md"`,
      { encoding: 'utf-8' }
    ).trim();
    return diff ? diff.split('\n').filter(Boolean) : [];
  } catch {
    console.log('Could not detect new posts via git diff (first commit?)');
    return [];
  }
}

// Generate LinkedIn post text from template
function generatePostText(frontmatter, url) {
  const title = frontmatter.title || 'New Blog Post';
  const description = frontmatter.description || '';
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];

  const hashtags = tags
    .slice(0, 5)
    .map((t) => `#${t.replace(/[\s-]+/g, '')}`)
    .join(' ');

  const lines = [`🚀 New Blog Post: ${title}`];

  if (description) {
    lines.push('', description);
  }

  if (hashtags) {
    lines.push('', hashtags);
  }

  lines.push('', `Read more 👉 ${url}`);

  return lines.join('\n');
}

// Post to LinkedIn
async function postToLinkedIn(text, articleUrl, frontmatter) {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const personUrn = process.env.LINKEDIN_PERSON_URN;

  if (!accessToken || !personUrn) {
    throw new Error(
      'Missing LINKEDIN_ACCESS_TOKEN or LINKEDIN_PERSON_URN environment variables'
    );
  }

  const body = {
    author: personUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text },
        shareMediaCategory: 'ARTICLE',
        media: [
          {
            status: 'READY',
            originalUrl: articleUrl,
            title: { text: frontmatter.title || 'New Blog Post' },
            description: { text: frontmatter.description || '' },
          },
        ],
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  };

  console.log(`Posting to LinkedIn: "${frontmatter.title}"`);
  console.log(`Article URL: ${articleUrl}`);

  const response = await fetch(LINKEDIN_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`LinkedIn API error (${response.status}): ${err}`);
  }

  const postId = response.headers.get('x-restli-id');
  console.log(`✅ LinkedIn post created: ${postId}`);
  return postId;
}

// Main
async function main() {
  const siteUrl = (
    process.env.SITE_URL || 'https://haflidif.github.io/azureviking-blog'
  ).replace(/\/$/, '');
  const specificSlug = process.env.POST_SLUG;
  const customText = process.env.CUSTOM_TEXT;

  let postsToShare = [];

  if (specificSlug) {
    // Manual trigger: share a specific post
    console.log(`Manual trigger: sharing post "${specificSlug}"`);

    // Find the post file
    const files = execSync(`ls ${POSTS_DIR}/*.md`, {
      encoding: 'utf-8',
    })
      .trim()
      .split('\n');

    for (const file of files) {
      const content = readFileSync(file, 'utf-8');
      const fm = parseFrontmatter(content);
      const slug =
        fm.slug || file.replace(`${POSTS_DIR}/`, '').replace('.md', '');
      if (slug === specificSlug) {
        postsToShare.push({ file, frontmatter: fm, slug });
        break;
      }
    }

    if (postsToShare.length === 0) {
      console.error(`Post not found: ${specificSlug}`);
      process.exit(1);
    }
  } else {
    // Auto-detect new posts
    const newFiles = detectNewPosts();
    if (newFiles.length === 0) {
      console.log('No new posts detected. Nothing to share.');
      return;
    }

    for (const file of newFiles) {
      if (!existsSync(file)) continue;
      const content = readFileSync(file, 'utf-8');
      const fm = parseFrontmatter(content);

      // Skip if social_skip is set
      if (fm.social_skip === 'true') {
        console.log(`Skipping "${fm.title}" (social_skip: true)`);
        continue;
      }

      // Skip drafts
      if (fm.draft === 'true') {
        console.log(`Skipping "${fm.title}" (draft)`);
        continue;
      }

      const slug =
        fm.slug || file.replace(`${POSTS_DIR}/`, '').replace('.md', '');
      postsToShare.push({ file, frontmatter: fm, slug });
    }
  }

  console.log(`Found ${postsToShare.length} post(s) to share on LinkedIn.\n`);

  for (const { frontmatter, slug } of postsToShare) {
    const articleUrl = `${siteUrl}/post/${slug}/`;
    const text = customText || frontmatter.social_text || generatePostText(frontmatter, articleUrl);

    try {
      await postToLinkedIn(text, articleUrl, frontmatter);
    } catch (err) {
      console.error(`❌ Failed to post "${frontmatter.title}": ${err.message}`);
      // Don't exit — continue with other posts
    }
  }

  console.log('\nDone!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
