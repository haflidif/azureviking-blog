#!/usr/bin/env node

/**
 * LinkedIn Writing Style Analyzer
 *
 * Reads exported LinkedIn data (posts, comments, articles) and
 * extracts writing style patterns for the blog-writer agent.
 *
 * Usage:
 *   node .github/scripts/analyze-writing-style.mjs
 *
 * Input:  .temp/linkedin-export/*.json (from linkedin-data-export.mjs)
 * Output: .temp/linkedin-export/style-analysis.md (human-readable report)
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';

const EXPORT_DIR = join(process.cwd(), '.temp', 'linkedin-export');

function loadJson(filename) {
  const path = join(EXPORT_DIR, filename);
  if (!existsSync(path)) {
    console.log(`  Skipping ${filename} (not found)`);
    return [];
  }
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    console.log(`  Skipping ${filename} (parse error)`);
    return [];
  }
}

/** Extract text content from various LinkedIn data formats */
function extractTexts(data, source) {
  const texts = [];

  for (const item of data) {
    let text = null;
    let date = null;

    if (source === 'posts') {
      // MEMBER_SHARE_INFO format: varies, look for common fields
      text =
        item['ShareCommentary'] ||
        item['Commentary'] ||
        item['commentary'] ||
        item['shareCommentary'] ||
        item['Share Commentary'] ||
        item['text'] ||
        item['Text'] ||
        item['content'] ||
        item['Content'];
      date = item['Created Date'] || item['createdAt'] || item['Date'] || item['date'];
    } else if (source === 'comments') {
      text =
        item['Message'] ||
        item['message'] ||
        item['Comment'] ||
        item['comment'] ||
        item['text'] ||
        item['Text'] ||
        item['content'];
      date = item['Date'] || item['date'] || item['Created Date'] || item['createdAt'];
    } else if (source === 'articles') {
      text =
        item['Content'] ||
        item['content'] ||
        item['Body'] ||
        item['body'] ||
        item['text'] ||
        item['Text'];
      date = item['Created Date'] || item['createdAt'] || item['Date'] || item['date'];
    }

    // Also try to extract from nested structures
    if (!text && typeof item === 'object') {
      for (const [key, value] of Object.entries(item)) {
        if (typeof value === 'string' && value.length > 20 && !key.toLowerCase().includes('url')) {
          text = value;
          break;
        }
      }
    }

    if (text && typeof text === 'string' && text.trim().length > 0) {
      texts.push({ text: text.trim(), date, source });
    }
  }

  return texts;
}

/** Analyze sentence patterns */
function analyzeSentences(texts) {
  const lengths = [];
  let totalSentences = 0;

  for (const { text } of texts) {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 5);
    for (const s of sentences) {
      const wordCount = s.trim().split(/\s+/).length;
      lengths.push(wordCount);
      totalSentences++;
    }
  }

  lengths.sort((a, b) => a - b);
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length || 0;
  const median = lengths[Math.floor(lengths.length / 2)] || 0;

  return {
    totalSentences,
    avgWordsPerSentence: Math.round(avg * 10) / 10,
    medianWordsPerSentence: median,
    shortSentences: lengths.filter((l) => l <= 8).length,
    longSentences: lengths.filter((l) => l > 25).length,
  };
}

/** Find common opening patterns */
function analyzeOpenings(texts) {
  const openings = {};
  const firstWords = {};

  for (const { text } of texts) {
    if (text.length < 20) continue;

    // First 3 words
    const words = text.split(/\s+/).slice(0, 3).join(' ').toLowerCase();
    firstWords[words] = (firstWords[words] || 0) + 1;

    // Categorize opening type
    const lower = text.toLowerCase();
    if (lower.startsWith('i ') || lower.startsWith("i'")) {
      openings['First person (I...)'] = (openings['First person (I...)'] || 0) + 1;
    } else if (/^(great|excited|happy|thrilled|proud|honored)/.test(lower)) {
      openings['Positive emotion'] = (openings['Positive emotion'] || 0) + 1;
    } else if (/^(if|when|have you|do you)/.test(lower)) {
      openings['Question/conditional'] = (openings['Question/conditional'] || 0) + 1;
    } else if (/^(the|this|these|that)/.test(lower)) {
      openings['Declarative (The/This...)'] = (openings['Declarative (The/This...)'] || 0) + 1;
    } else if (/^(just|so|well|hey|hi)/.test(lower)) {
      openings['Casual/conversational'] = (openings['Casual/conversational'] || 0) + 1;
    } else if (/^(check|read|see|look)/.test(lower)) {
      openings['Call to action'] = (openings['Call to action'] || 0) + 1;
    } else if (/^[\u{1F389}\u{1F680}\u{1F525}\u{1F4A1}\u{2728}\u{2764}\u{1F44F}]/u.test(text)) {
      openings['Emoji lead'] = (openings['Emoji lead'] || 0) + 1;
    } else {
      openings['Other'] = (openings['Other'] || 0) + 1;
    }
  }

  // Top first-word combos
  const topFirstWords = Object.entries(firstWords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  return { openings, topFirstWords };
}

/** Find common closing patterns */
function analyzeClosings(texts) {
  const closings = {};

  for (const { text } of texts) {
    if (text.length < 50) continue;

    // Last sentence
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 3);
    if (sentences.length === 0) continue;
    const last = sentences[sentences.length - 1].trim().toLowerCase();

    if (/hashtag|#\w/.test(text.slice(-100))) {
      closings['Hashtags'] = (closings['Hashtags'] || 0) + 1;
    }
    if (/here'?s to/.test(last)) {
      closings["Here's to..."] = (closings["Here's to..."] || 0) + 1;
    }
    if (/check it out|check out|read more|link in/.test(last)) {
      closings['CTA (check out/read more)'] = (closings['CTA (check out/read more)'] || 0) + 1;
    }
    if (/thank|thanks|grateful|appreciate/.test(last)) {
      closings['Gratitude'] = (closings['Gratitude'] || 0) + 1;
    }
    if (/what do you think|thoughts|agree|let me know/.test(last)) {
      closings['Engagement question'] = (closings['Engagement question'] || 0) + 1;
    }
    if (/excited|looking forward|can'?t wait/.test(last)) {
      closings['Forward-looking'] = (closings['Forward-looking'] || 0) + 1;
    }
    if (/[\u{1F680}\u{1F3A4}\u{1F389}\u{1F4AA}\u{1F525}\u{2764}\u{2728}]/u.test(text.slice(-20))) {
      closings['Emoji sign-off'] = (closings['Emoji sign-off'] || 0) + 1;
    }
  }

  return closings;
}

/** Analyze hashtag usage */
function analyzeHashtags(texts) {
  const hashtags = {};

  for (const { text } of texts) {
    const matches = text.match(/#\w+/g);
    if (matches) {
      for (const tag of matches) {
        const normalized = tag.toLowerCase();
        hashtags[normalized] = (hashtags[normalized] || 0) + 1;
      }
    }
  }

  return Object.entries(hashtags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30);
}

/** Analyze emoji usage */
function analyzeEmoji(texts) {
  // Match common emoji ranges, excluding combining/joining characters that cause lint issues
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/gu;

  const emojis = {};
  let postsWithEmoji = 0;
  let postsWithoutEmoji = 0;

  for (const { text } of texts) {
    const matches = text.match(emojiRegex);
    if (matches) {
      postsWithEmoji++;
      for (const e of matches) {
        emojis[e] = (emojis[e] || 0) + 1;
      }
    } else {
      postsWithoutEmoji++;
    }
  }

  const topEmoji = Object.entries(emojis)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  return { postsWithEmoji, postsWithoutEmoji, topEmoji };
}

/** Find common phrases (2-3 word n-grams) */
function analyzeCommonPhrases(texts) {
  const bigrams = {};
  const trigrams = {};

  for (const { text } of texts) {
    const words = text
      .toLowerCase()
      .replace(/[^\w\s']/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 1);

    for (let i = 0; i < words.length - 1; i++) {
      const bi = `${words[i]} ${words[i + 1]}`;
      bigrams[bi] = (bigrams[bi] || 0) + 1;

      if (i < words.length - 2) {
        const tri = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
        trigrams[tri] = (trigrams[tri] || 0) + 1;
      }
    }
  }

  // Filter out very common English stopword combinations
  const stopPhrases = new Set([
    'in the',
    'of the',
    'to the',
    'and the',
    'on the',
    'for the',
    'with the',
    'is a',
    'it is',
    'this is',
    'that is',
    'i am',
    'i have',
    'to be',
    'of a',
    'in a',
    'and a',
    'at the',
    'from the',
  ]);

  const topBigrams = Object.entries(bigrams)
    .filter(([phrase]) => !stopPhrases.has(phrase))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  const topTrigrams = Object.entries(trigrams)
    .filter(([phrase]) =>
      phrase
        .split(' ')
        .some(
          (w) =>
            ![
              'the',
              'a',
              'an',
              'is',
              'to',
              'in',
              'of',
              'and',
              'for',
              'on',
              'with',
              'at',
              'from',
              'it',
              'that',
              'this',
            ].includes(w)
        )
    )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  return { topBigrams, topTrigrams };
}

/** Analyze punctuation and dash usage */
function analyzePunctuation(texts) {
  let emDash = 0;
  let enDash = 0;
  let doubleDash = 0;
  let ellipsis = 0;
  let exclamation = 0;
  let question = 0;

  for (const { text } of texts) {
    emDash += (text.match(/—/g) || []).length;
    enDash += (text.match(/–/g) || []).length;
    doubleDash += (text.match(/--/g) || []).length;
    ellipsis += (text.match(/\.{3}/g) || []).length;
    exclamation += (text.match(/!/g) || []).length;
    question += (text.match(/\?/g) || []).length;
  }

  return { emDash, enDash, doubleDash, ellipsis, exclamation, question };
}

/** Analyze post length distribution */
function analyzePostLengths(texts) {
  const lengths = texts.map((t) => t.text.length);
  const wordCounts = texts.map((t) => t.text.split(/\s+/).length);

  lengths.sort((a, b) => a - b);
  wordCounts.sort((a, b) => a - b);

  return {
    totalPosts: texts.length,
    avgChars: Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length || 0),
    avgWords: Math.round(wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length || 0),
    medianWords: wordCounts[Math.floor(wordCounts.length / 2)] || 0,
    shortPosts: wordCounts.filter((w) => w <= 20).length,
    mediumPosts: wordCounts.filter((w) => w > 20 && w <= 100).length,
    longPosts: wordCounts.filter((w) => w > 100).length,
  };
}

function generateReport(allTexts, posts, comments, articles) {
  const postTexts = allTexts.filter((t) => t.source === 'posts');
  const commentTexts = allTexts.filter((t) => t.source === 'comments');

  const sentences = analyzeSentences(allTexts);
  const { openings, topFirstWords } = analyzeOpenings(postTexts);
  const closings = analyzeClosings(postTexts);
  const hashtags = analyzeHashtags(allTexts);
  const emoji = analyzeEmoji(allTexts);
  const { topBigrams, topTrigrams } = analyzeCommonPhrases(allTexts);
  const punctuation = analyzePunctuation(allTexts);
  const postLengths = analyzePostLengths(postTexts);
  const commentLengths = analyzePostLengths(commentTexts);

  let report = `# LinkedIn Writing Style Analysis\n\n`;
  report += `Generated: ${new Date().toISOString().split('T')[0]}\n\n`;
  report += `## Data Summary\n`;
  report += `- **Posts/Shares:** ${posts.length} records (${postTexts.length} with text)\n`;
  report += `- **Comments:** ${comments.length} records (${commentTexts.length} with text)\n`;
  report += `- **Articles:** ${articles.length} records\n`;
  report += `- **Total texts analyzed:** ${allTexts.length}\n\n`;

  report += `## Post Length Distribution\n`;
  report += `| Metric | Posts | Comments |\n|--------|-------|----------|\n`;
  report += `| Average words | ${postLengths.avgWords} | ${commentLengths.avgWords} |\n`;
  report += `| Median words | ${postLengths.medianWords} | ${commentLengths.medianWords} |\n`;
  report += `| Short (≤20 words) | ${postLengths.shortPosts} | ${commentLengths.shortPosts} |\n`;
  report += `| Medium (21-100 words) | ${postLengths.mediumPosts} | ${commentLengths.mediumPosts} |\n`;
  report += `| Long (>100 words) | ${postLengths.longPosts} | ${commentLengths.longPosts} |\n\n`;

  report += `## Sentence Structure\n`;
  report += `- Total sentences analyzed: ${sentences.totalSentences}\n`;
  report += `- Average words per sentence: ${sentences.avgWordsPerSentence}\n`;
  report += `- Median words per sentence: ${sentences.medianWordsPerSentence}\n`;
  report += `- Short sentences (≤8 words): ${sentences.shortSentences} (${Math.round((sentences.shortSentences / sentences.totalSentences) * 100)}%)\n`;
  report += `- Long sentences (>25 words): ${sentences.longSentences} (${Math.round((sentences.longSentences / sentences.totalSentences) * 100)}%)\n\n`;

  report += `## Opening Patterns (Posts)\n`;
  for (const [pattern, count] of Object.entries(openings).sort((a, b) => b[1] - a[1])) {
    report += `- **${pattern}:** ${count}\n`;
  }
  report += `\n### Most Common First Words\n`;
  for (const [phrase, count] of topFirstWords) {
    report += `- "${phrase}..." (${count}x)\n`;
  }

  report += `\n## Closing Patterns (Posts)\n`;
  for (const [pattern, count] of Object.entries(closings).sort((a, b) => b[1] - a[1])) {
    report += `- **${pattern}:** ${count}\n`;
  }

  report += `\n## Punctuation Usage\n`;
  report += `- Em dash (—): ${punctuation.emDash}\n`;
  report += `- En dash (–): ${punctuation.enDash}\n`;
  report += `- Double dash (--): ${punctuation.doubleDash}\n`;
  report += `- Ellipsis (...): ${punctuation.ellipsis}\n`;
  report += `- Exclamation marks: ${punctuation.exclamation}\n`;
  report += `- Question marks: ${punctuation.question}\n\n`;

  report += `## Top Hashtags\n`;
  for (const [tag, count] of hashtags) {
    report += `- ${tag} (${count}x)\n`;
  }

  report += `\n## Emoji Usage\n`;
  report += `- Posts with emoji: ${emoji.postsWithEmoji} (${Math.round((emoji.postsWithEmoji / allTexts.length) * 100)}%)\n`;
  report += `- Posts without emoji: ${emoji.postsWithoutEmoji}\n`;
  report += `\n### Top Emoji\n`;
  for (const [e, count] of emoji.topEmoji) {
    report += `- ${e} (${count}x)\n`;
  }

  report += `\n## Common Phrases (2-word)\n`;
  for (const [phrase, count] of topBigrams) {
    report += `- "${phrase}" (${count}x)\n`;
  }

  report += `\n## Common Phrases (3-word)\n`;
  for (const [phrase, count] of topTrigrams) {
    report += `- "${phrase}" (${count}x)\n`;
  }

  // Extract sample posts (longest ones, most representative)
  report += `\n## Sample Posts (Longest, for voice reference)\n\n`;
  const longest = postTexts.sort((a, b) => b.text.length - a.text.length).slice(0, 5);
  for (let i = 0; i < longest.length; i++) {
    const { text, date } = longest[i];
    report += `### Sample ${i + 1}${date ? ` (${date})` : ''}\n`;
    report += `> ${text.slice(0, 500)}${text.length > 500 ? '...' : ''}\n\n`;
  }

  return report;
}

function main() {
  console.log('LinkedIn Writing Style Analyzer\n');

  const posts = loadJson('member-share-info.json');
  const comments = loadJson('all-comments.json');
  const articles = loadJson('articles.json');

  if (posts.length === 0 && comments.length === 0 && articles.length === 0) {
    console.error('No data found! Run linkedin-data-export.mjs first.');
    console.error(`Expected data in: ${EXPORT_DIR}`);
    process.exit(1);
  }

  console.log(
    `Loaded: ${posts.length} posts, ${comments.length} comments, ${articles.length} articles`
  );

  // Extract text content
  const postTexts = extractTexts(posts, 'posts');
  const commentTexts = extractTexts(comments, 'comments');
  const articleTexts = extractTexts(articles, 'articles');
  const allTexts = [...postTexts, ...commentTexts, ...articleTexts];

  console.log(
    `Extracted text from: ${postTexts.length} posts, ${commentTexts.length} comments, ${articleTexts.length} articles`
  );

  if (allTexts.length === 0) {
    console.error('\nNo text content could be extracted from the data.');
    console.error('The data format may be different than expected.');
    console.error('Dumping first record from each source for debugging:\n');

    if (posts.length > 0) {
      console.error('First post record keys:', Object.keys(posts[0]));
      console.error('First post record:', JSON.stringify(posts[0], null, 2).slice(0, 500));
    }
    if (comments.length > 0) {
      console.error('\nFirst comment record keys:', Object.keys(comments[0]));
      console.error('First comment record:', JSON.stringify(comments[0], null, 2).slice(0, 500));
    }
    process.exit(1);
  }

  // Generate report
  const report = generateReport(allTexts, posts, comments, articles);
  const reportPath = join(EXPORT_DIR, 'style-analysis.md');
  writeFileSync(reportPath, report);
  console.log(`\nStyle analysis saved to: ${reportPath}`);
  console.log('\nKey findings will be printed below:\n');

  // Print summary to console
  console.log(report);
}

main();
