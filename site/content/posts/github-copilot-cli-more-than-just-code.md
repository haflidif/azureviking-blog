---
title: 'GitHub Copilot CLI: More Than Just Code - Part 1'
slug: 'github-copilot-cli-more-than-just-code'
description: 'Part 1 of a series exploring creative uses of GitHub Copilot in the terminal. This time: resizing and refining my Azure Viking banner for LinkedIn, without ever opening Photoshop.'
pubDate: 2026-03-02
tags: [github-copilot, cli, productivity, creative, tools]
category: blog
featured: true
draft: false
coverImage: '/images/posts/github-copilot-cli-image-resizing/cover.jpg'
series:
  id: 'copilot-cli-creative'
  order: 1
social_text: |
  I needed to resize a banner for my LinkedIn company page. Instead of opening Photoshop, I opened my terminal.

  What happened next genuinely surprised me.

  GitHub Copilot CLI helped me:
  ✅ Resize with proper aspect ratios
  ✅ Center crop without losing the logo
  ✅ Scale and fill with matching background
  ✅ Extend edge patterns for a seamless finish

  All from natural language prompts. No GUI. No Photoshop. Just a conversation in the terminal.

  The full story, with code snippets and before/after screenshots 👇

  #githubcopilot #cli #productivity #creative #tools #sharingiscaring
---

![GitHub Copilot CLI: More Than Just Code](/images/posts/github-copilot-cli-image-resizing/cover.jpg)

I needed to resize a banner for my LinkedIn company page. Instead of opening Photoshop, I opened my terminal. What happened next genuinely surprised me.

## A Simple Task, Or So I Thought

I had my Azure Viking banner, a **1586×398** image that I use across a few platforms. LinkedIn wanted a company page banner at exactly **1128×191 pixels**. Easy, right? Just resize it and be done.

The thing is, those two sizes have completely different aspect ratios. The original is roughly 4:1, but LinkedIn wants almost 6:1. If you just force-resize it, everything gets squished. And I knew that, but I also knew I did not want to open Photoshop or Figma for something this simple.

So I did something I have been doing more and more lately. I asked **GitHub Copilot in the terminal**.

## What Is GitHub Copilot CLI?

<video autoplay muted playsinline style="width:100%;border-radius:8px;margin-bottom:1rem;">
  <source src="/images/posts/github-copilot-cli-image-resizing/copilot-cli-banner.mp4" type="video/mp4" />
</video>

For those who have not tried it yet, GitHub Copilot now works directly in the terminal. You can have a conversation with it, ask it to do things, and it will generate and run code for you, right there in your command line. No IDE needed.

I have been using it for code-related tasks for a while, but this time I wanted to see how it handles something more creative. Image manipulation. Design work. The kind of thing most developers would reach for a GUI tool to do.

## Attempt 1: "Just Resize It"

My first prompt was straightforward:

> _"Can you resize this image to LinkedIn company page size banner: 1128×191px?"_

Copilot immediately generated a Python script using the **Pillow** library. It opened my image, resized it to the target dimensions, and saved it. Clean, fast, done.

```python
from PIL import Image

img = Image.open('new_azure_viking_logo_banner_2_linkedin.jpeg')
img_resized = img.resize((1128, 191), Image.LANCZOS)
img_resized.save('banner_1128x191.jpeg', quality=95)
```

Except the result looked **stretched**. The Viking logo was squished, the text looked off. The aspect ratio difference had done its damage.

![Stretched result](/images/posts/github-copilot-cli-image-resizing/step1-stretched-1128x191.jpeg)

_Not great. The Viking helmet is not supposed to look like that._

## Attempt 2: Center Crop

I told Copilot the image looked stretched and asked if there was a way to fix it. What happened next is what I love about this tool. **It offered me choices.** It explained the aspect ratio mismatch and suggested two approaches:

1. **Center crop & resize**: trim the top and bottom to match the ratio, then resize
2. **Fit with background fill**: scale to fit and fill the sides with the background color

I went with the center crop. Copilot generated a new script that calculated exactly how much to trim, cropped from the center, and resized.

```python
target_ratio = 1128 / 191
new_h = int(w / target_ratio)  # Height needed to match ratio
top = (h - new_h) // 2         # Trim evenly from top and bottom

cropped = img.crop((0, top, w, top + new_h))
resized = cropped.resize((1128, 191), Image.LANCZOS)
```

Better! The proportions were correct now. But there was a new problem. **The Viking logo got cut off.** The horns at the top and the "2022" at the bottom were trimmed away.

![Cropped result](/images/posts/github-copilot-cli-image-resizing/step2-cropped-1128x191.jpeg)

_Proportions are right, but we lost the top of the helmet and the bottom details._

## Attempt 3: Scale to Fit

So I told Copilot: _"The logo gets cut off... can't we just minimize the logo and modify the picture so it looks similar but smaller with the logo in the center?"_

This time, Copilot took a different approach. Instead of cropping, it **scaled the entire image down** to fit within the 191-pixel height, then placed it centered on a new canvas. It even sampled the dark navy background color directly from my original image to fill the sides.

```python
bg_color = img.getpixel((10, 10))  # Sample the navy background
scale = target_h / h               # Scale factor to fit height
new_w = int(w * scale)             # New width after scaling

scaled = img.resize((new_w, target_h), Image.LANCZOS)

canvas = Image.new('RGB', (1128, 191), bg_color)
x_offset = (1128 - new_w) // 2
canvas.paste(scaled, (x_offset, 0))
```

Now the full logo was visible and centered. But the empty navy sides felt a bit plain.

![Scaled result](/images/posts/github-copilot-cli-image-resizing/step3-scaled-1128x191.jpeg)

_Logo is fully visible. But those empty sides need something._

## Attempt 4: The Final Touch

Here is where it got really interesting. My original banner has these **diagonal light blue stripes** that bleed into the edges, and they are part of the design. I asked Copilot to extend those stripes outward to fill the empty space.

Copilot grabbed thin strips from the left and right edges of the scaled image, where the stripe pattern already existed, and **tiled them outward** to fill the empty space on both sides. It then pasted the main content on top, creating a seamless extension of the original design.

```python
# Grab edge strips containing the stripe pattern
left_strip = scaled.crop((0, 0, 30, target_h))
right_strip = scaled.crop((new_w - 30, 0, new_w, target_h))

# Tile them outward
for x in range(x_offset - 30, -30, -30):
    canvas.paste(left_strip, (x, 0))

for x in range(content_right, 1128, 30):
    canvas.paste(right_strip, (x, 0))
```

I also noticed the logo was not perfectly centered. It was slightly shifted to the right. I mentioned this to Copilot, and it analyzed the image using **numpy** to find the visual center of the content versus the mathematical center. Turns out the original design had the logo offset by 82 pixels. Copilot adjusted the placement so the logo appeared dead center in the final banner.

![Final result](/images/posts/github-copilot-cli-image-resizing/step4-final-1128x191.jpeg)

_That is more like it. Full logo, matching stripes, properly centered._

## What I Learned

This entire session took about **five minutes**, from the first prompt to the final result. And I never left my terminal. Here is what stood out to me:

**It is a conversation, not a command.** I did not need to know the exact Pillow API or the math behind aspect ratios. I described what I wanted, said what looked wrong, and refined from there. Just like talking to a colleague who happens to know Python image processing.

**The iterations are the feature.** Getting it wrong the first time was not a failure. It was part of the workflow. Each attempt got closer, and Copilot adapted based on my feedback. It even offered multiple approaches and let me choose.

**It is not just for code.** I have been using Copilot CLI mostly for infrastructure scripts, Terraform modules, and debugging. But this showed me it handles creative tasks just as well. Image manipulation, design adjustments, color sampling, all from natural language.

**You do not need to be an expert.** I know my way around Python, but I am definitely not a Pillow expert. Copilot handled the library-specific details like resampling algorithms, pixel coordinate math, and color sampling, so I could focus on what I actually cared about: how the banner looked.

## Your Turn

If you have not tried GitHub Copilot in the terminal yet, I really encourage you to give it a go. And not just for the obvious coding tasks. Try it for the weird stuff. Image resizing, file conversion, data transformation, or whatever task you would normally reach for a separate tool to handle.

You might be surprised what your terminal can do when it has Copilot on its side.

Huge thanks to the GitHub Copilot team for building something that keeps surprising me with what it can do. I am excited to keep pushing the boundaries of what is possible from the terminal.

---

_Have you used GitHub Copilot CLI for something unexpected? I would love to hear about it. Connect with me on [LinkedIn](https://www.linkedin.com/in/haflidif/) or check out my work on [GitHub](https://github.com/haflidif)._ 🛠️

---

_In **Part 2**, I take things further with video editing. Terminal recordings, ffmpeg compression, speed adjustments, and creating cover photos, all from the command line with Copilot. Stay tuned!_
