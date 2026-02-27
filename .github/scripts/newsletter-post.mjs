#!/usr/bin/env node
/**
 * EmailOctopus Newsletter Script
 *
 * Detects new blog posts and sends newsletter emails via EmailOctopus automation API.
 * Called by the newsletter-post.yml GitHub Actions workflow.
 *
 * Environment variables:
 *   EMAILOCTOPUS_API_KEY       - API v2 Bearer token
 *   EMAILOCTOPUS_LIST_ID       - Subscriber list UUID
 *   EMAILOCTOPUS_AUTOMATION_ID - Automation UUID (must have "Started via API" trigger)
 *   SITE_URL                   - Blog base URL (e.g., https://azureviking.com)
 *   POST_SLUG                  - (optional) Specific post slug to send
 *   DRY_RUN                    - (optional) Set to "true" for preview mode
 */

import { readFileSync, readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';

const API_BASE = 'https://api.emailoctopus.com';
const POSTS_DIR = 'site/content/posts';

const API_KEY = process.env.EMAILOCTOPUS_API_KEY;
const LIST_ID = process.env.EMAILOCTOPUS_LIST_ID;
const AUTOMATION_ID = process.env.EMAILOCTOPUS_AUTOMATION_ID;
const SITE_URL = process.env.SITE_URL || 'https://azureviking.com';
const POST_SLUG = process.env.POST_SLUG || '';
const DRY_RUN = process.env.DRY_RUN === 'true';

// Rate limiting: 10 req/s max
const RATE_LIMIT_DELAY = 120; // ms between requests

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

    if (inArray && line.match(/^\s+-\s+/)) {
      arrayValues.push(line.replace(/^\s+-\s+/, '').replace(/['"]/g, ''));
      continue;
    }

    if (inArray && !line.match(/^\s+-\s+/)) {
      fm[currentKey] = arrayValues;
      inArray = false;
      arrayValues = [];
    }

    const kvMatch = line.match(/^(\w[\w_]*)\s*:\s*(.*)/);
    if (kvMatch) {
      const [, key, value] = kvMatch;
      const trimmed = value.trim();
      if (trimmed === '|' || trimmed === '>') {
        currentKey = key;
        inMultiline = true;
        multilineLines = [];
      } else if (trimmed === '') {
        currentKey = key;
        inArray = true;
        arrayValues = [];
      } else {
        let val = trimmed.replace(/^['"]/, '').replace(/['"]$/, '');
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

  if (inArray && arrayValues.length > 0) fm[currentKey] = arrayValues;
  if (inMultiline && multilineLines.length > 0) fm[currentKey] = multilineLines.join('\n').trim();

  return fm;
}

function extractExcerpt(content, maxLen = 200) {
  const body = content.replace(/^---[\s\S]*?---/, '').trim();
  const lines = body.split(/\r?\n/);
  let excerpt = '';
  for (const line of lines) {
    const trimmed = line.trim();
    // Skip headings, images, code blocks, HTML, empty lines
    if (
      !trimmed ||
      trimmed.startsWith('#') ||
      trimmed.startsWith('!') ||
      trimmed.startsWith('```') ||
      trimmed.startsWith('<') ||
      trimmed.startsWith('---')
    )
      continue;
    // Strip markdown formatting
    excerpt = trimmed
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/`(.*?)`/g, '$1');
    break;
  }
  if (excerpt.length > maxLen) {
    excerpt = excerpt.slice(0, maxLen).replace(/\s+\S*$/, '') + '…';
  }
  return excerpt;
}

function detectNewPosts() {
  try {
    const diff = execSync(
      `git diff --name-only --diff-filter=A HEAD~1 HEAD -- "${POSTS_DIR}/*.md"`,
      { encoding: 'utf-8' }
    ).trim();
    return diff ? diff.split('\n').filter(Boolean) : [];
  } catch {
    console.log('Could not detect new posts via git diff');
    return [];
  }
}

function findPostBySlug(slug) {
  const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md') && !f.startsWith('_'));
  for (const file of files) {
    const content = readFileSync(`${POSTS_DIR}/${file}`, 'utf-8');
    const fm = parseFrontmatter(content);
    const fileSlug = fm.slug || file.replace(/\.md$/, '');
    if (fileSlug === slug) return { file: `${POSTS_DIR}/${file}`, content, fm, slug: fileSlug };
  }
  return null;
}

async function apiRequest(method, path, body = null) {
  const url = `${API_BASE}${path}`;
  const opts = {
    method,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`API ${method} ${path} failed (${res.status}): ${JSON.stringify(data)}`);
  }
  return data;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getAllContacts() {
  const contacts = [];
  let cursor = null;

  do {
    const params = new URLSearchParams({ limit: '100', status: 'subscribed' });
    if (cursor) params.set('starting_after', cursor);

    const data = await apiRequest('GET', `/lists/${LIST_ID}/contacts?${params}`);
    if (data.data) contacts.push(...data.data);

    cursor = data.paging?.next?.starting_after || null;
    if (cursor) await sleep(RATE_LIMIT_DELAY);
  } while (cursor);

  return contacts;
}

async function batchUpdateFields(contacts, fields) {
  // Process in batches of 50
  const BATCH_SIZE = 50;
  for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
    const batch = contacts.slice(i, i + BATCH_SIZE);
    const members = batch.map((c) => ({
      id: c.id,
      fields,
    }));

    await apiRequest('PUT', `/lists/${LIST_ID}/contacts/batch`, { contacts: members });
    console.log(
      `  Updated fields for contacts ${i + 1}-${Math.min(i + BATCH_SIZE, contacts.length)}`
    );
    await sleep(RATE_LIMIT_DELAY);
  }
}

async function triggerAutomation(contacts) {
  let success = 0;
  let errors = 0;

  for (const contact of contacts) {
    try {
      await apiRequest('POST', `/automations/${AUTOMATION_ID}/queue`, {
        contact_id: contact.id,
      });
      success++;
    } catch (err) {
      errors++;
      console.error(`  Failed for ${contact.email_address}: ${err.message}`);
    }
    await sleep(RATE_LIMIT_DELAY);

    // Progress update every 50
    if ((success + errors) % 50 === 0) {
      console.log(
        `  Progress: ${success + errors}/${contacts.length} (${success} ok, ${errors} errors)`
      );
    }
  }

  return { success, errors };
}

// --- Main ---
async function main() {
  if (!DRY_RUN && (!API_KEY || !LIST_ID || !AUTOMATION_ID)) {
    console.error(
      'Missing required environment variables: EMAILOCTOPUS_API_KEY, EMAILOCTOPUS_LIST_ID, EMAILOCTOPUS_AUTOMATION_ID'
    );
    process.exit(1);
  }

  // Find the post to send
  let postData = null;

  if (POST_SLUG) {
    postData = findPostBySlug(POST_SLUG);
    if (!postData) {
      console.error(`Post not found: ${POST_SLUG}`);
      process.exit(1);
    }
  } else {
    const newFiles = detectNewPosts();
    for (const file of newFiles) {
      const content = readFileSync(file, 'utf-8');
      const fm = parseFrontmatter(content);
      if (fm.draft === 'true' || fm.draft === true) continue;
      if (fm.newsletter_skip === 'true' || fm.newsletter_skip === true) continue;
      const slug = fm.slug || file.replace(/^.*\//, '').replace(/\.md$/, '');
      postData = { file, content, fm, slug };
      break; // Send for the first eligible new post
    }
  }

  if (!postData) {
    console.log('No eligible posts found for newsletter');
    process.exit(0);
  }

  const { fm, slug, content } = postData;
  const title = fm.title || slug;
  const postUrl = `${SITE_URL}/post/${slug}`;
  const excerpt = fm.description || extractExcerpt(content);

  console.log('=== Newsletter Post ===');
  console.log(`Title:   ${title}`);
  console.log(`URL:     ${postUrl}`);
  console.log(`Excerpt: ${excerpt}`);
  console.log('');

  if (DRY_RUN) {
    console.log('[DRY RUN] Would update contact fields:');
    console.log(`  LatestPostTitle:   ${title}`);
    console.log(`  LatestPostUrl:     ${postUrl}`);
    console.log(`  LatestPostExcerpt: ${excerpt}`);
    console.log('');
    console.log('[DRY RUN] Would trigger automation for all subscribed contacts');
    console.log('[DRY RUN] No API calls made');
    process.exit(0);
  }

  // 1. Get all subscribed contacts
  console.log('Fetching contacts...');
  const contacts = await getAllContacts();
  console.log(`Found ${contacts.length} subscribed contacts`);

  if (contacts.length === 0) {
    console.log('No contacts to send to');
    process.exit(0);
  }

  // 2. Batch-update custom fields with post data
  console.log('Updating contact fields...');
  await batchUpdateFields(contacts, {
    LatestPostTitle: title,
    LatestPostUrl: postUrl,
    LatestPostExcerpt: excerpt,
  });
  console.log('Fields updated');

  // 3. Trigger automation for each contact
  console.log('Triggering automation...');
  const result = await triggerAutomation(contacts);
  console.log('');
  console.log(`=== Complete ===`);
  console.log(`Sent: ${result.success} | Errors: ${result.errors} | Total: ${contacts.length}`);

  if (result.errors > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Newsletter script failed:', err);
  process.exit(1);
});
