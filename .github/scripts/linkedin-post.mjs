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
 *   SITE_URL               - Blog base URL (e.g., https://azureviking.com)
 *   POST_SLUG              - (optional) Specific post slug to share
 *   CUSTOM_TEXT             - (optional) Custom LinkedIn post text
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';

const LINKEDIN_API = 'https://api.linkedin.com/v2/ugcPosts';
const POSTS_DIR = 'site/content/posts';

// Parse YAML frontmatter from a markdown file
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const fm = {};
  const lines = match[1].split(/\r?\n/);
  let currentKey = null;
  let inArray = false;
  let arrayValues = [];
  let inMultiline = false;
  let multilineLines = [];

  for (const line of lines) {
    // Collecting multiline block scalar (| or >)
    if (inMultiline) {
      if (line.match(/^\s{2}/) || line.trim() === '') {
        multilineLines.push(line.replace(/^ {2}/, ''));
        continue;
      } else {
        fm[currentKey] = multilineLines.join('\n').trim();
        inMultiline = false;
        multilineLines = [];
      }
    }

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
      const trimmed = value.trim();
      if (trimmed === '|' || trimmed === '>') {
        // YAML block scalar
        currentKey = key;
        inMultiline = true;
        multilineLines = [];
      } else if (trimmed === '') {
        // Might be start of array or empty value
        currentKey = key;
        // Peek: if next items are array items, handle in next iteration
        inArray = true;
        arrayValues = [];
      } else {
        let val = trimmed.replace(/^['"]/, '').replace(/['"]$/, '');
        // Handle inline arrays: [item1, item2, item3]
        if (val.startsWith('[') && val.endsWith(']')) {
          fm[key] = val
            .slice(1, -1)
            .split(',')
            .map((v) => v.trim().replace(/^['"]/, '').replace(/['"]$/, ''))
            .filter(Boolean);
        } else {
          fm[key] = val;
        }
      }
    }
  }

  if (inArray && arrayValues.length > 0) {
    fm[currentKey] = arrayValues;
  }
  if (inMultiline && multilineLines.length > 0) {
    fm[currentKey] = multilineLines.join('\n').trim();
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

// Detect post category from title and tags for personalized intro
function detectPostCategory(title, tags) {
  const titleLower = title.toLowerCase();
  const allTags = tags.map((t) => t.toLowerCase());

  if (titleLower.includes('review') || titleLower.includes('first look')) return 'review';
  if (
    titleLower.includes('terraform') ||
    titleLower.includes('module') ||
    allTags.includes('terraform')
  )
    return 'module';
  if (
    allTags.includes('public speaking') ||
    allTags.includes('career') ||
    titleLower.includes('speaking') ||
    titleLower.includes('goodbye') ||
    titleLower.includes('mvp')
  )
    return 'personal';
  if (
    allTags.includes('azure') ||
    allTags.includes('security') ||
    allTags.includes('fido2') ||
    titleLower.includes('azure')
  )
    return 'technical';
  return 'general';
}

// Pick a contextual opening line based on post category
function getPersonalIntro(category, title) {
  const intros = {
    review: [
      `I have been testing out some interesting hardware and wanted to share my honest thoughts.`,
      `Got my hands on something worth reviewing — here is what I found after putting it through its paces.`,
      `Another hands-on review from the lab! I always enjoy digging into new security hardware.`,
    ],
    module: [
      `I have been working on something I think the community will find useful.`,
      `Sharing a Terraform module I built to solve a real-world problem I kept running into.`,
      `Open source contribution time! I packaged up a solution I have been refining across multiple projects.`,
    ],
    personal: [
      `Something a bit more personal today — stepping outside the usual tech content.`,
      `Not every post has to be technical. Sometimes it is good to reflect on the journey.`,
      `Sharing some personal reflections today.`,
    ],
    technical: [
      `Deep dive time! I have been exploring this topic and wanted to break it down for the community.`,
      `Here is a practical guide based on real-world experience — not just theory.`,
      `Wrote up something I think fellow cloud professionals will find valuable.`,
    ],
    general: [
      `Just published a new blog post that I think you will find interesting.`,
      `New content on the blog — I would love to hear your thoughts.`,
    ],
  };

  const options = intros[category] || intros.general;
  // Deterministic pick based on title length to avoid random variation
  return options[title.length % options.length];
}

// Extract first meaningful paragraph from markdown content
function getExcerpt(content, maxLen = 200) {
  // Remove frontmatter
  const body = content.replace(/^---[\s\S]*?---\s*/, '');
  // Find first paragraph (skip headings, images, empty lines)
  const paragraphs = body.split(/\n\n+/);
  for (const p of paragraphs) {
    const trimmed = p.trim();
    if (
      !trimmed ||
      trimmed.startsWith('#') ||
      trimmed.startsWith('!') ||
      trimmed.startsWith('<') ||
      trimmed.startsWith('```') ||
      trimmed.startsWith('|') ||
      trimmed.startsWith('-') ||
      trimmed.startsWith('_') ||
      trimmed.toLowerCase().startsWith('disclaimer')
    )
      continue;
    // Clean markdown formatting
    const clean = trimmed
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
      .replace(/[*_`]/g, '') // bold/italic/code
      .replace(/\n/g, ' ')
      .trim();
    if (clean.length > 30) {
      return clean.length > maxLen
        ? clean.substring(0, maxLen).replace(/\s\S*$/, '') + '...'
        : clean;
    }
  }
  return '';
}

// Generate LinkedIn post text from template
function generatePostText(frontmatter, url, fileContent) {
  const title = frontmatter.title || 'New Blog Post';
  const description = frontmatter.description || '';
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];

  const category = detectPostCategory(title, tags);
  const intro = getPersonalIntro(category, title);
  const excerpt = fileContent ? getExcerpt(fileContent, 180) : description;

  const hashtags = tags
    .slice(0, 5)
    .map((t) => `#${t.replace(/[\s-]+/g, '')}`)
    .join(' ');

  const lines = [intro, '', `📝 ${title}`];

  // Use excerpt for a teaser, fall back to description
  const teaser = excerpt || description;
  if (teaser) {
    lines.push('', teaser);
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
    throw new Error('Missing LINKEDIN_ACCESS_TOKEN or LINKEDIN_PERSON_URN environment variables');
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
  const siteUrl = (process.env.SITE_URL || 'https://azureviking.com').replace(
    /\/$/,
    ''
  );
  const specificSlug = process.env.POST_SLUG?.replace(/[^a-zA-Z0-9_-]/g, '') || '';
  const customText = process.env.CUSTOM_TEXT?.slice(0, 3000) || '';

  let postsToShare = [];

  if (specificSlug) {
    // Manual trigger: share a specific post
    console.log(`Manual trigger: sharing post "${specificSlug}"`);

    // Find the post file
    const files = readdirSync(POSTS_DIR)
      .filter((f) => f.endsWith('.md'))
      .map((f) => `${POSTS_DIR}/${f}`);

    for (const file of files) {
      const content = readFileSync(file, 'utf-8');
      const fm = parseFrontmatter(content);
      const slug = fm.slug || file.replace(`${POSTS_DIR}/`, '').replace('.md', '');
      if (slug === specificSlug) {
        postsToShare.push({ file, frontmatter: fm, slug, content });
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

      const slug = fm.slug || file.replace(`${POSTS_DIR}/`, '').replace('.md', '');
      postsToShare.push({ file, frontmatter: fm, slug, content });
    }
  }

  console.log(`Found ${postsToShare.length} post(s) to share on LinkedIn.\n`);

  for (const { frontmatter, slug, content } of postsToShare) {
    const articleUrl = `${siteUrl}/post/${slug}/`;
    const text =
      customText || frontmatter.social_text || generatePostText(frontmatter, articleUrl, content);

    // Dry run mode: preview without posting
    if (process.env.DRY_RUN === 'true') {
      console.log('--- LinkedIn Post Preview ---');
      console.log(text);
      console.log('--- Article URL:', articleUrl, '---');
      console.log();
      continue;
    }

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
