#!/usr/bin/env node

/**
 * LinkedIn Data Export via Member Data Portability API (DMA)
 *
 * Fetches your LinkedIn posts, comments, and articles using the
 * Member Snapshot API. Requires an access token generated via
 * LinkedIn's OAuth Token Generator Tool with r_dma_portability_self_serve scope.
 *
 * Usage:
 *   $env:LINKEDIN_DPA_TOKEN = "your_token_here"
 *   node .github/scripts/linkedin-data-export.mjs
 *
 * Output:
 *   .temp/linkedin-export/member-share-info.json
 *   .temp/linkedin-export/all-comments.json
 *   .temp/linkedin-export/articles.json
 */

import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const TOKEN = process.env.LINKEDIN_DPA_TOKEN;
if (!TOKEN) {
  console.error('Error: Set LINKEDIN_DPA_TOKEN environment variable');
  console.error('Generate one at: https://www.linkedin.com/developers/ → Docs and Tools → OAuth Token Tools');
  process.exit(1);
}

const BASE_URL = 'https://api.linkedin.com/rest/memberSnapshotData';
const HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  'Linkedin-Version': '202312',
  'X-Restli-Protocol-Version': '2.0.0',
};

const OUTPUT_DIR = join(process.cwd(), '.temp', 'linkedin-export');

// Domains relevant for writing style analysis
const DOMAINS = [
  { domain: 'MEMBER_SHARE_INFO', file: 'member-share-info.json', label: 'Posts & Shares' },
  { domain: 'ALL_COMMENTS', file: 'all-comments.json', label: 'Comments' },
  { domain: 'ARTICLES', file: 'articles.json', label: 'Articles' },
];

async function fetchDomain(domain) {
  const allData = [];
  let start = 0;
  let hasMore = true;

  while (hasMore) {
    const url = `${BASE_URL}?q=criteria&domain=${domain}&start=${start}&count=10`;
    console.log(`  Fetching ${domain} page ${start}...`);

    const response = await fetch(url, { headers: HEADERS });

    if (!response.ok) {
      const text = await response.text();
      // "No data found" means we've reached the end
      if (text.includes('No data found') || response.status === 404) {
        console.log(`  Reached end of ${domain} data at page ${start}`);
        break;
      }
      // Rate limit
      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after') || '60';
        console.log(`  Rate limited. Waiting ${retryAfter}s...`);
        await sleep(parseInt(retryAfter) * 1000);
        continue;
      }
      console.error(`  Error fetching ${domain}: ${response.status} ${text}`);
      break;
    }

    const data = await response.json();

    if (data.elements && data.elements.length > 0) {
      for (const element of data.elements) {
        if (element.snapshotData) {
          allData.push(...element.snapshotData);
        }
      }
    }

    // Check for next page
    const nextLink = data.paging?.links?.find((l) => l.rel === 'next');
    if (nextLink) {
      // Extract start param from next link
      const nextUrl = new URL(nextLink.href, 'https://api.linkedin.com');
      start = parseInt(nextUrl.searchParams.get('start') || String(start + 1));
    } else {
      hasMore = false;
    }

    // Be gentle with the API
    await sleep(1000);
  }

  return allData;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('LinkedIn Data Export (Member Data Portability API)\n');

  // Create output directory
  mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const { domain, file, label } of DOMAINS) {
    console.log(`\nFetching ${label} (${domain})...`);

    try {
      const data = await fetchDomain(domain);
      const outputPath = join(OUTPUT_DIR, file);
      writeFileSync(outputPath, JSON.stringify(data, null, 2));
      console.log(`  Saved ${data.length} records to ${outputPath}`);
    } catch (error) {
      console.error(`  Failed to fetch ${domain}: ${error.message}`);
    }
  }

  console.log('\nExport complete! Run the analysis script next:');
  console.log('  node .github/scripts/analyze-writing-style.mjs');
}

main().catch(console.error);
