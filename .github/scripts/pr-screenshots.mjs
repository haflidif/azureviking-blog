#!/usr/bin/env node
/**
 * PR Visual Preview — Playwright Screenshot Script
 *
 * Takes screenshots of new/changed blog posts at multiple viewports and themes.
 * Used by the pr-preview.yml workflow to post visual previews on PRs.
 *
 * Environment variables:
 *   BASE_URL     - URL where the built site is served (default: http://localhost:4321)
 *   CHANGED_FILES - Newline-separated list of changed files from the PR diff
 *   OUTPUT_DIR   - Directory to save screenshots (default: screenshots)
 */

import { chromium } from 'playwright';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';

const BASE_URL = (process.env.BASE_URL || 'http://localhost:4321').replace(/\/$/, '');
const OUTPUT_DIR = process.env.OUTPUT_DIR || 'screenshots';
const CHANGED_FILES = process.env.CHANGED_FILES || '';

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 390, height: 844 },
];

const THEMES = ['light', 'dark'];

// Extract post slugs from changed file paths
function detectPostSlugs(changedFiles) {
  const slugs = new Set();
  for (const file of changedFiles.split('\n').filter(Boolean)) {
    // Match site/content/posts/{slug}.md
    const match = file.match(/site\/content\/posts\/([^/]+)\.md$/);
    if (match) {
      slugs.add(match[1]);
    }
  }
  return [...slugs];
}

// Try to read the slug from frontmatter (the slug field may differ from filename)
function getSlugFromFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!fmMatch) return null;
    const slugMatch = fmMatch[1].match(/^slug:\s*['"]?([^'"\n]+)['"]?\s*$/m);
    return slugMatch ? slugMatch[1].trim() : null;
  } catch {
    return null;
  }
}

async function takeScreenshots() {
  const fileSlugs = detectPostSlugs(CHANGED_FILES);

  if (fileSlugs.length === 0) {
    console.log('No blog post changes detected. Checking for component/style changes...');
    // If CSS/component files changed, screenshot the homepage as a sanity check
    const hasVisualChanges = CHANGED_FILES.split('\n').some(
      (f) =>
        f.match(/\.(svelte|astro|css|ts)$/) &&
        (f.includes('src/components') ||
          f.includes('src/layouts') ||
          f.includes('src/styles') ||
          f.includes('src/pages'))
    );
    if (!hasVisualChanges) {
      console.log('No visual changes detected. Skipping screenshots.');
      writeFileSync(`${OUTPUT_DIR}/results.json`, JSON.stringify({ screenshots: [] }));
      return;
    }
    // Screenshot homepage for component/style changes
    fileSlugs.push('__homepage__');
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const results = [];

  for (const fileSlug of fileSlugs) {
    // Resolve the actual URL slug from frontmatter if possible
    let urlSlug = fileSlug;
    let pageUrl;

    if (fileSlug === '__homepage__') {
      pageUrl = `${BASE_URL}/`;
      urlSlug = 'homepage';
    } else {
      const fmSlug = getSlugFromFile(`site/content/posts/${fileSlug}.md`);
      if (fmSlug) urlSlug = fmSlug;
      pageUrl = `${BASE_URL}/post/${urlSlug}/`;
    }

    console.log(`\n📸 Screenshotting: ${pageUrl}`);

    for (const viewport of VIEWPORTS) {
      for (const theme of THEMES) {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          colorScheme: theme,
        });
        const page = await context.newPage();

        // Set theme class before navigation
        await page.addInitScript((t) => {
          if (t === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', '"dark"');
          } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', '"light"');
          }
        }, theme);

        try {
          await page.goto(pageUrl, { waitUntil: 'networkidle', timeout: 30000 });

          // Ensure theme class is applied after hydration
          await page.evaluate((t) => {
            if (t === 'dark') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }, theme);

          // Wait for any animations/transitions
          await page.waitForTimeout(500);

          const filename = `${urlSlug}-${viewport.name}-${theme}.png`;
          const filepath = `${OUTPUT_DIR}/${filename}`;

          await page.screenshot({ path: filepath, fullPage: true });
          console.log(`  ✅ ${filename}`);

          results.push({
            slug: urlSlug,
            viewport: viewport.name,
            theme,
            filename,
            url: pageUrl,
          });
        } catch (err) {
          console.error(`  ❌ Failed: ${viewport.name}-${theme}: ${err.message}`);
        }

        await context.close();
      }
    }
  }

  await browser.close();

  // Write results for the PR comment step
  writeFileSync(`${OUTPUT_DIR}/results.json`, JSON.stringify({ screenshots: results }, null, 2));
  console.log(`\n📋 ${results.length} screenshots saved to ${OUTPUT_DIR}/`);
}

takeScreenshots().catch((err) => {
  console.error('Screenshot script failed:', err);
  process.exit(1);
});
