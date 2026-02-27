---
name: image-toolkit
description: >
  Image manipulation, resizing, and optimization toolkit. Knows social media dimensions,
  blog image conventions, and best practices for image processing with Python/Pillow.
  USE FOR: resize image, crop image, compress image, convert image format, social media
  dimensions, LinkedIn banner, Twitter header, Instagram post, YouTube thumbnail, optimize
  images, batch resize, watermark, aspect ratio, image quality, cover image, profile picture,
  favicon, OG image, create banner, image for blog post.
---

# Image Toolkit Skill

You are an image manipulation expert. Use Python with the **Pillow** (PIL) library for all image operations. Always use `Image.LANCZOS` for downscaling and `Image.BICUBIC` for upscaling.

## Social Media Image Dimensions (2026)

### LinkedIn

| Type                    | Size (px)   | Aspect Ratio | Notes                       |
| ----------------------- | ----------- | ------------ | --------------------------- |
| Company Page Banner     | 1128 × 191  | ~5.9:1       |                             |
| Personal Profile Banner | 1584 × 396  | 4:1          |                             |
| Profile Photo           | 400 × 400   | 1:1          | Displays as circle          |
| Post Image (landscape)  | 1200 × 627  | ~1.91:1      | Recommended for link shares |
| Post Image (square)     | 1080 × 1080 | 1:1          |                             |
| Post Image (portrait)   | 1080 × 1350 | 4:5          |                             |
| Article Cover           | 1200 × 644  | ~1.86:1      |                             |
| Event Cover             | 1776 × 444  | 4:1          |                             |

### X (Twitter)

| Type            | Size (px)  | Aspect Ratio |
| --------------- | ---------- | ------------ |
| Header/Banner   | 1500 × 500 | 3:1          |
| Profile Photo   | 400 × 400  | 1:1          |
| In-stream Image | 1200 × 675 | 16:9         |
| Card Image      | 1200 × 628 | ~1.91:1      |

### Facebook

| Type          | Size (px)   | Aspect Ratio |
| ------------- | ----------- | ------------ |
| Cover Photo   | 820 × 312   | ~2.63:1      |
| Profile Photo | 170 × 170   | 1:1          |
| Post Image    | 1200 × 630  | ~1.91:1      |
| Event Cover   | 1920 × 1005 | ~1.91:1      |

### Instagram

| Type             | Size (px)   | Aspect Ratio |
| ---------------- | ----------- | ------------ |
| Post (square)    | 1080 × 1080 | 1:1          |
| Post (landscape) | 1080 × 566  | ~1.91:1      |
| Post (portrait)  | 1080 × 1350 | 4:5          |
| Story / Reel     | 1080 × 1920 | 9:16         |
| Profile Photo    | 320 × 320   | 1:1          |

### YouTube

| Type           | Size (px)   | Aspect Ratio |
| -------------- | ----------- | ------------ |
| Channel Banner | 2560 × 1440 | 16:9         |
| Thumbnail      | 1280 × 720  | 16:9         |
| Profile Photo  | 800 × 800   | 1:1          |

### GitHub

| Type                | Size (px)  | Aspect Ratio |
| ------------------- | ---------- | ------------ |
| Social Preview (OG) | 1280 × 640 | 2:1          |
| Profile Photo       | 500 × 500  | 1:1          |
| README Banner       | 1280 × 640 | 2:1          |

### Open Graph / General Web

| Type             | Size (px)          | Aspect Ratio |
| ---------------- | ------------------ | ------------ |
| OG Image         | 1200 × 630         | ~1.91:1      |
| Favicon          | 32 × 32 or 16 × 16 | 1:1          |
| Apple Touch Icon | 180 × 180          | 1:1          |

## AzureViking Blog Image Conventions

This blog (azureviking.com) uses **Astro** with **Sharp** for image optimization.

### Cover Images

- **Path convention**: `site/assets/images/posts/{slug}/cover.png`
- **Frontmatter**: `coverImage: '/images/posts/{slug}/cover.png'`
- **Recommended size**: 1200 × 630px (OG-compatible, works across social shares)
- **Format**: PNG or JPEG (Sharp handles optimization)

### Profile / Bio Images

- About page profile: 400 × 400px
- BioCard component: 200 × 200px (main), 120 × 120px (badge)

### Social Image (for sharing)

- Use `socialImage` frontmatter field when different from cover
- Recommended: 1200 × 630px for universal compatibility

## Resize Strategies

When the source and target have **different aspect ratios**, choose the right strategy:

### 1. Scale to Fit (Recommended default)

Scale the image to fit within the target dimensions, preserving aspect ratio. Fill remaining space with background color sampled from the image.

```python
from PIL import Image

img = Image.open('source.jpg')
w, h = img.size

# Sample background color from a solid area
bg_color = img.getpixel((5, 5))

# Scale to fit target
target_w, target_h = 1200, 630
scale = min(target_w / w, target_h / h)
new_w, new_h = int(w * scale), int(h * scale)
scaled = img.resize((new_w, new_h), Image.LANCZOS)

# Center on canvas
canvas = Image.new('RGB', (target_w, target_h), bg_color)
canvas.paste(scaled, ((target_w - new_w) // 2, (target_h - new_h) // 2))
canvas.save('output.jpg', quality=95)
```

### 2. Center Crop

Crop to target aspect ratio from center, then resize. Best when content is centered and losing edges is acceptable.

```python
target_ratio = target_w / target_h
img_ratio = w / h

if img_ratio > target_ratio:
    # Image is wider — crop sides
    new_w = int(h * target_ratio)
    left = (w - new_w) // 2
    cropped = img.crop((left, 0, left + new_w, h))
else:
    # Image is taller — crop top/bottom
    new_h = int(w / target_ratio)
    top = (h - new_h) // 2
    cropped = img.crop((0, top, w, top + new_h))

result = cropped.resize((target_w, target_h), Image.LANCZOS)
```

### 3. Smart Crop (Content-Aware)

Use when the subject is not centered. Analyze brightness/content to find the visual center and crop around it.

```python
import numpy as np

arr = np.array(img)
brightness = arr.mean(axis=2)
# Find content center by weighted average
y_weights = brightness.mean(axis=1)
x_weights = brightness.mean(axis=0)
cy = int(np.average(range(h), weights=y_weights))
cx = int(np.average(range(w), weights=x_weights))
# Crop centered on (cx, cy) with target aspect ratio
```

### 4. Extend / Tile

When the image is smaller than target, extend edges by tiling edge strips outward. Good for banners with repeating patterns.

```python
# Grab edge strips and tile outward
left_strip = scaled.crop((0, 0, 30, new_h))
right_strip = scaled.crop((new_w - 30, 0, new_w, new_h))

for x in range(offset - 30, -30, -30):
    canvas.paste(left_strip, (x, 0))
for x in range(offset + new_w, target_w, 30):
    canvas.paste(right_strip, (x, 0))
```

## Quality Settings

| Format | Quality      | Use Case                                           |
| ------ | ------------ | -------------------------------------------------- |
| JPEG   | `quality=95` | High quality, minimal compression                  |
| JPEG   | `quality=85` | Good balance for web                               |
| JPEG   | `quality=70` | Smaller file size, acceptable for thumbnails       |
| PNG    | N/A          | Lossless, use for graphics/logos with transparency |
| WebP   | `quality=85` | Modern format, better compression than JPEG        |

## Best Practices

1. **Always preserve the original** — save to a new file, never overwrite the source.
2. **Use LANCZOS resampling** for downscaling (sharpest results).
3. **Sample background colors** from the image rather than hardcoding values.
4. **Check visual centering** — the mathematical center of an image may not be the visual center. Use numpy to find content center when precision matters.
5. **Batch operations** — when resizing for multiple platforms, process all sizes from the original (not from a previously resized version) to avoid quality degradation.
6. **Format selection**: Use JPEG for photos, PNG for graphics/logos with transparency, WebP for modern web delivery.
