---
title: 'GitHub Copilot CLI: More Than Just Code - Part 2'
slug: 'github-copilot-cli-more-than-just-code-part-2'
description: 'Part 2 of the series. This time I used GitHub Copilot in the terminal to compress terminal recordings, trim video clips, and create cover photos. All from the command line.'
pubDate: 2026-03-18
tags: [github-copilot, cli, ffmpeg, video, creative, tools]
category: blog
featured: false
draft: false
coverImage: '/images/posts/github-copilot-cli-video-editing/cover.jpg'
series:
  id: 'copilot-cli-creative'
  order: 2
social_text: |
  In Part 1, I resized a banner. In Part 2, I went further.

  This time I used GitHub Copilot CLI to:
  ✅ Compress an 18MB terminal recording to 158KB
  ✅ Speed up video 3x with ffmpeg filters
  ✅ Trim and crop video clips frame-perfectly
  ✅ Create a cover photo from Playwright screenshots
  ✅ Center content using numpy pixel analysis

  All from the terminal. No video editor. No Photoshop.

  #githubcopilot #cli #ffmpeg #video #creative #sharingiscaring
---

In [Part 1](/post/github-copilot-cli-more-than-just-code), I used GitHub Copilot CLI to resize a banner image through four iterative attempts. That was fun, but it was just the beginning. This time, I needed to work with **video**.

## The Setup

I was wrapping up my WordPress-to-Astro migration post. I wanted a demo video showing GitHub Copilot CLI in action. I had a **ZoomIt screen recording** of the Copilot startup animation. That beautiful ASCII art banner when you launch it. The recording was raw. **18MB.** Full screen. A few seconds of nothing at the start.

I also needed a **cover photo** for the blog post. Something that showed the transformation from old to new. WordPress on one side, the shiny new Astro site on the other.

Both tasks screamed "open a video editor" and "open Photoshop." I will not lie, part of me almost did. Instead, I opened my terminal.

## Task 1: Taming an 18MB Recording

My first question to Copilot was simple:

<div class="terminal-chat" data-animate>
  <div class="terminal-chat-glow"></div>
  <div class="terminal-chat-inner">
    <div class="terminal-chat-header">
      <div class="terminal-chat-dots"><span></span><span></span><span></span></div>
      <span class="terminal-chat-title">Copilot Chat</span>
    </div>
    <div class="terminal-chat-body">
      <div>
        <p class="terminal-chat-label">YOU</p>
        <p class="terminal-chat-prompt">Can you compress this video? It is 18MB and that is way too big for a blog post.</p>
      </div>
      <div class="terminal-chat-reasoning">
        <p class="terminal-chat-reasoning-label">🤖 <span class="thinking-indicator">Thinking...</span></p>
        <p class="reasoning-line">Terminal recordings are mostly static pixels between frames. Only the cursor and new text change, so H.264 inter-frame compression will be extremely effective here.</p>
        <p class="reasoning-line">I'll use -crf 18 (near-lossless), strip audio with -an since screen recordings don't need sound, and add -movflags +faststart so the browser can start playback before the full file downloads.</p>
      </div>
      <hr class="terminal-chat-divider">
      <div class="terminal-chat-response">
        <p class="terminal-chat-label">COPILOT</p>
        <div class="terminal-chat-agents">
          <div class="agent-line" style="--delay: 0">
            <span class="agent-icon agent-icon-green">📦</span>
            <div>
              <span class="agent-name agent-name-green">Install</span>
              <span class="agent-task"> — winget install Gyan.FFmpeg</span>
            </div>
          </div>
          <div class="agent-line" style="--delay: 1">
            <span class="agent-icon agent-icon-blue">🎬</span>
            <div>
              <span class="agent-name agent-name-blue">Compress</span>
              <span class="agent-task"> — H.264 encoding with CRF 18, strip audio, optimize for web</span>
            </div>
          </div>
          <div class="agent-line" style="--delay: 2">
            <span class="agent-icon agent-icon-purple">📊</span>
            <div>
              <span class="agent-name agent-name-purple">Result</span>
              <span class="agent-task"> — 18MB → 369KB. Near-lossless quality.</span>
            </div>
          </div>
        </div>
      </div>
      <div class="terminal-chat-status">
        <div class="terminal-chat-status-dots"><span></span><span></span><span></span></div>
        <span class="terminal-chat-status-text">Response complete</span>
      </div>
    </div>
  </div>
</div>

Copilot did not even hesitate. It installed **ffmpeg** via `winget install Gyan.FFmpeg`. Then generated a compression command:

```bash
ffmpeg -i copilot-start.mp4 \
  -c:v libx264 -crf 18 -preset slow \
  -vf "fps=24" -an \
  -movflags +faststart \
  copilot-start-compressed.mp4
```

**18MB down to 369KB.** Near-lossless quality. Copilot knew exactly why these settings made sense and chose them without being told.

## Speeding Things Up

The recording was good, but at normal speed it felt slow. I asked Copilot to speed it up 3x. It added a video filter:

```bash
-vf "setpts=PTS/3,fps=24"
```

The `setpts=PTS/3` filter divides each frame's timestamp by 3, making playback three times faster. Combined with the fps filter, Copilot kept the output smooth and the file size tiny. **7.7 seconds, 158KB.** That's smaller than most images on my site.

<div class="copilot-thinking">
<p>Speeding up video isn't just about changing the playback rate. If I only use <code>setpts=PTS/3</code>, the output would have 3x as many frames per second as intended, bloating the file. By chaining it with <code>fps=24</code>, I normalize the frame rate back down: speed up first, then drop excess frames. Smooth playback, minimal file size.</p>
</div>

## Precision Trimming

There was still a problem: the first second or so was just a blank terminal. I told Copilot to trim 1 second from the start.

```bash
-ss 1
```

Then I watched it and asked for another half second off. Copilot adjusted to `-ss 1.5` without missing a beat. Each trim was instant. No scrubbing through a timeline, no dragging handles. Just a conversation.

<div class="copilot-thinking">
<p>I'm placing <code>-ss</code> before the input file, not after. This tells ffmpeg to seek at the demuxer level, so it jumps directly to the target timestamp without decoding all the frames before it. For a quick trim like this, it's nearly instant instead of processing the entire video just to discard the beginning.</p>
</div>

## Extracting the Banner Clip

Later, I wanted just the **Copilot ASCII art banner** from a different, longer recording. I told Copilot: _"I only want the banner part. It starts around 3 seconds and is visible until about 5.5 seconds."_

Copilot trimmed the 7-second video to **1.9 seconds**. Cropped the window title bar. Optimized it to **37KB**:

```bash
ffmpeg -i github-copilot-banner.mp4 \
  -ss 3.8 -t 1.9 \
  -vf "crop=1444:862:0:36" \
  -c:v libx264 -crf 23 -preset slow -an \
  copilot-cli-banner.mp4
```

The crop filter (`crop=width:height:x:y`) removed exactly the top 36 pixels where the tab bar sat. Copilot figured out the dimensions from the source video.

<div class="copilot-thinking">
<p>The source video is 1444x898. The window title bar is 36 pixels tall. I can see that from the video metadata and the visible chrome. So I'll crop to <code>1444:862:0:36</code>: full width, height minus 36, starting at x=0 y=36. Combined with <code>-ss 3.8 -t 1.9</code> for the exact banner appearance window, and <code>-crf 23</code> since this clip is short enough that a slightly higher CRF still looks clean.</p>
</div>

## Task 2: Creating a Cover Photo

Now for the cover photo. I wanted a **side-by-side comparison**: the old WordPress site on the left, the new Astro site on the right. The kind of "before and after" that tells the story at a glance.

<div class="terminal-chat" data-animate>
  <div class="terminal-chat-glow"></div>
  <div class="terminal-chat-inner">
    <div class="terminal-chat-header">
      <div class="terminal-chat-dots"><span></span><span></span><span></span></div>
      <span class="terminal-chat-title">Copilot Chat</span>
    </div>
    <div class="terminal-chat-body">
      <div>
        <p class="terminal-chat-label">YOU</p>
        <p class="terminal-chat-prompt">I need a cover photo for my blog post. A side-by-side comparison. The old WordPress site on the left, the new Astro site on the right.</p>
      </div>
      <div class="terminal-chat-reasoning">
        <p class="terminal-chat-reasoning-label">🤖 <span class="thinking-indicator">Thinking...</span></p>
        <p class="reasoning-line">Manual screenshots would be inconsistent. Different browser sizes, scroll positions, timing. Playwright gives exact viewport control and deterministic captures.</p>
        <p class="reasoning-line">I'll set color_scheme: "dark" on the new site because the dark theme will create stronger visual contrast against the lighter WordPress screenshot.</p>
      </div>
      <hr class="terminal-chat-divider">
      <div class="terminal-chat-response">
        <p class="terminal-chat-label">COPILOT</p>
        <div class="terminal-chat-agents">
          <div class="agent-line" style="--delay: 0">
            <span class="agent-icon agent-icon-blue">🎭</span>
            <div>
              <span class="agent-name agent-name-blue">Playwright</span>
              <span class="agent-task"> — capturing WordPress at 1400×900</span>
            </div>
          </div>
          <div class="agent-line" style="--delay: 1">
            <span class="agent-icon agent-icon-purple">🌙</span>
            <div>
              <span class="agent-name agent-name-purple">Playwright</span>
              <span class="agent-task"> — capturing Astro site in dark mode</span>
            </div>
          </div>
          <div class="agent-line" style="--delay: 2">
            <span class="agent-icon agent-icon-green">🖼️</span>
            <div>
              <span class="agent-name agent-name-green">Pillow</span>
              <span class="agent-task"> — composing side-by-side with diagonal stripe</span>
            </div>
          </div>
        </div>
      </div>
      <div class="terminal-chat-status">
        <div class="terminal-chat-status-dots"><span></span><span></span><span></span></div>
        <span class="terminal-chat-status-text">Response complete</span>
      </div>
    </div>
  </div>
</div>

Copilot reached for **Playwright** to capture screenshots of both sites:

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # Old WordPress site
    page = browser.new_page(viewport={"width": 1400, "height": 900})
    page.goto("https://azureviking.com")
    page.screenshot(path="wordpress.png")

    # New Astro site (dark mode)
    page = browser.new_page(
        viewport={"width": 1400, "height": 900},
        color_scheme="dark"
    )
    page.goto("http://localhost:4321")
    page.screenshot(path="astro.png")
```

Notice how it captured the new site in dark mode using `color_scheme="dark"`. I did not even ask for that. Copilot just knew the new site had a dark theme and made it look its best.

## The Diagonal Stripe

I wanted a clean diagonal stripe separating the two screenshots. Not a boring vertical split. Something with a bit of style. This led to an iterative process that reminded me of the banner resizing from Part 1.

**Attempt 1:** Copilot added a diagonal with arrow icons. Too busy. _"Drop the arrows, just the stripe."_

**Attempt 2:** Clean diagonal stripe, but the transition was soft and blurry. _"Make it sharper."_

**Attempt 3:** Sharp diagonal with the WordPress side desaturated and dimmed to create contrast:

```python
from PIL import Image, ImageEnhance

# Desaturate the old site
old_img = ImageEnhance.Color(old_img).enhance(0.3)
old_img = ImageEnhance.Brightness(old_img).enhance(0.7)
```

The old WordPress side looked faded and dated. The new Astro site popped with vibrant dark mode colors. The diagonal stripe cut between them cleanly.

<div class="copilot-thinking">
<p>A straight 50/50 split treats both screenshots as equals, but this is a "before → after" story. Desaturating the WordPress side to 30% color and dimming to 70% brightness makes it visually recede. The viewer's eye is naturally drawn to the vibrant Astro side. The diagonal stripe adds energy compared to a vertical split, reinforcing the sense of transformation.</p>
</div>

## Centering the Content

But the cover photo looked off-center. The visual content was shifted to the left. I mentioned this, and Copilot did something clever:

<div class="terminal-chat" data-animate>
  <div class="terminal-chat-glow"></div>
  <div class="terminal-chat-inner">
    <div class="terminal-chat-header">
      <div class="terminal-chat-dots"><span></span><span></span><span></span></div>
      <span class="terminal-chat-title">Copilot Chat</span>
    </div>
    <div class="terminal-chat-body">
      <div>
        <p class="terminal-chat-label">YOU</p>
        <p class="terminal-chat-prompt">The cover photo looks off-center. The visual content is shifted to the left.</p>
      </div>
      <div class="terminal-chat-reasoning">
        <p class="terminal-chat-reasoning-label">🤖 <span class="thinking-indicator">Thinking...</span></p>
        <p class="reasoning-line">The content isn't centered in the frame. Hardcoding a pixel offset would be fragile and break if the source images change.</p>
        <p class="reasoning-line">Instead, I'll analyze the actual pixel brightness across every column with numpy to find where the visual content starts and ends, then calculate the true center mathematically.</p>
      </div>
      <hr class="terminal-chat-divider">
      <div class="terminal-chat-response">
        <p class="terminal-chat-label">COPILOT</p>
        <div class="terminal-chat-agents">
          <div class="agent-line" style="--delay: 0">
            <span class="agent-icon agent-icon-cyan">🔬</span>
            <div>
              <span class="agent-name agent-name-cyan">numpy</span>
              <span class="agent-task"> — analyzing pixel brightness across all columns</span>
            </div>
          </div>
          <div class="agent-line" style="--delay: 1">
            <span class="agent-icon agent-icon-yellow">📐</span>
            <div>
              <span class="agent-name agent-name-yellow">Calculate</span>
              <span class="agent-task"> — content spans px 13 to 794, visual center at 403</span>
            </div>
          </div>
          <div class="agent-line" style="--delay: 2">
            <span class="agent-icon agent-icon-green">✅</span>
            <div>
              <span class="agent-name agent-name-green">Recompose</span>
              <span class="agent-task"> — padding adjusted, content perfectly centered</span>
            </div>
          </div>
        </div>
      </div>
      <div class="terminal-chat-status">
        <div class="terminal-chat-status-dots"><span></span><span></span><span></span></div>
        <span class="terminal-chat-status-text">Response complete</span>
      </div>
    </div>
  </div>
</div>

It used **numpy** to analyze pixel brightness across columns. Found the actual visual center of the content.

```python
import numpy as np

arr = np.array(img)
col_brightness = arr.mean(axis=(0, 2))
content_cols = np.where(col_brightness > threshold)[0]
visual_center = (content_cols[0] + content_cols[-1]) // 2
```

The content spanned from pixel 13 to 794 in a 1444-pixel frame. Mathematical center was at 722, but the visual center was at 403. Copilot calculated the right padding to center it perfectly.

## What Stood Out

**ffmpeg is powerful but cryptic.** I know ffmpeg exists. I have used it before. But I never remember the filter syntax, the codec flags, or the crop coordinates. Copilot handled all of that. I just said what I wanted, and it translated that into the right command.

**The iteration loop is fast.** Each adjustment (speed, trim, crop) was a single prompt and instant result. In a GUI video editor, I would have been scrubbing timelines and waiting for renders. Here, each attempt took seconds.

**Mixing tools is natural.** In one session, Copilot used ffmpeg for video, Playwright for screenshots, **Pillow** for image composition, and numpy for pixel analysis. It picked the right tool for each sub-task without me needing to think about it.

**Creative work is just problem-solving.** Writing Terraform modules or composing a cover photo? Same process. Describe. Evaluate. Refine. Copilot fits into that loop perfectly.

Huge thanks to the ffmpeg, Playwright, and Pillow communities. These open-source tools are incredible, and Copilot made them feel like they were built into my terminal.

## Your Turn

Got a creative task that feels like it needs a GUI? I really encourage you to try your terminal first. The fastest path from "I need this" to "done" might just be a Copilot conversation.

Part 3 is brewing. Next time, I'm bringing Copilot into my day job: Azure architecture, infrastructure code I didn't write, and real-world troubleshooting. I cannot wait to share that one. Stay tuned.

---

_Missed Part 1? Check out how I used Copilot CLI to [resize a banner image through four iterative attempts](/post/github-copilot-cli-more-than-just-code)._

_Got your own Copilot CLI stories? I would love to hear them. Find me on [LinkedIn](https://www.linkedin.com/in/haflidif/) or [GitHub](https://github.com/haflidif)._ 🛠️
