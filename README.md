# F\*ckSAT Redirect Gateway (fucksat.com → BlitzSAT)

This repo powers **fucksat.com**, a tiny Next.js redirect gateway that converts “messy” YouTube links into the **one canonical SAT generator URL** on **BlitzSAT**:

- **Canonical destination (always):** `https://www.blitzsat.com/generate/youtube/<VIDEO_ID>`

Backlinks:
- **BlitzSAT homepage:** `https://www.blitzsat.com/`
- **BlitzSAT YouTube SAT generator:** `https://www.blitzsat.com/generate/youtube/`

## What it does (in plain English)

You paste a YouTube link (or just a video ID) into **fucksat.com** and it will:

- **Extract the YouTube video ID** (the 11-character code)
- **Redirect you to BlitzSAT** using the exact format:
  - `https://www.blitzsat.com/generate/youtube/<VIDEO_ID>`

That’s it — no extra query strings, no encoded full URL in the final path, just the video ID.

## Usage (examples)

These are the common formats users type:

```
https://fucksat.com/9szhjhO9epA
→ https://www.blitzsat.com/generate/youtube/9szhjhO9epA

https://fucksat.com/https://www.youtube.com/watch?v=9szhjhO9epA
→ https://www.blitzsat.com/generate/youtube/9szhjhO9epA

https://fucksat.com/https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D9szhjhO9epA
→ https://www.blitzsat.com/generate/youtube/9szhjhO9epA

https://fucksat.com/https://youtu.be/9szhjhO9epA
→ https://www.blitzsat.com/generate/youtube/9szhjhO9epA
```

## Supported inputs

- **Plain YouTube video ID** (11 characters)
- **YouTube watch URLs** (`youtube.com/watch?v=...`)
- **Short links** (`youtu.be/...`)
- **Embed / legacy URLs** (`youtube.com/embed/...`, `youtube.com/v/...`)
- **Weird pasted paths** (browsers may normalize `https://` in the path to `https:/` — we still try to extract the ID)

## Implementation details (how it’s built)

### Edge middleware (fast path)

Most requests are handled in `middleware.ts` at the edge, so redirects happen before React renders.

### Catch-all page (fallback)

If middleware doesn’t run for some edge-case request shape, the fallback route `src/app/[...slug]/page.tsx` runs the same extraction logic and redirects.

### Video ID extraction

All redirect outputs are **canonicalized** to the video ID via a shared helper:

- `extractYouTubeVideoId(...)` in `src/lib/youtube-redirect.ts`

### Next.js config redirects

`next.config.ts` includes a redirect rule so `/<VIDEO_ID>` always maps to:

- `https://www.blitzsat.com/generate/youtube/<VIDEO_ID>`

## SAT exam overview (SEO)

The **SAT** is a standardized test used by many colleges in the United States. Most students focus on:

- **SAT Math**: algebra, problem solving, data analysis, and some advanced math topics
- **SAT Reading & Writing**: grammar, rhetoric, and reading comprehension from short passages

Effective SAT prep usually comes down to:

- **Targeted practice** (questions matched to the exact skill you’re missing)
- **Error analysis** (why you missed it, not just the correct answer)
- **Timed sets** to build pacing and consistency

This project is designed to make it trivial to go from a YouTube lesson to a SAT practice flow on **BlitzSAT**:

- `https://www.blitzsat.com/` (BlitzSAT)
- `https://www.blitzsat.com/generate/youtube/` (YouTube → SAT practice generator)

## Edge cases handled

1. **Pasted full URLs in the path**: `https://fucksat.com/https://www.youtube.com/watch?v=...`
2. **Browser-normalized paths**: `https://` may become `https:/` in the request path
3. **Extra watch params**: we still extract the `v=` ID
4. **Invalid links**: redirect to the BlitzSAT homepage

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

This application can be deployed to any platform that supports Next.js:
- Vercel (recommended)
- Netlify
- Railway
- AWS
- Google Cloud Platform

## Testing

Useful checks:

```bash
# Expected: Location: https://www.blitzsat.com/generate/youtube/9szhjhO9epA
curl -sI "https://fucksat.com/https://www.youtube.com/watch?v=9szhjhO9epA"

# Expected: Location: https://www.blitzsat.com/generate/youtube/9szhjhO9epA
curl -sI "https://fucksat.com/9szhjhO9epA"
```

## Security Considerations

- Only YouTube inputs that yield a valid 11-char video ID are redirected onward
- Redirect output is canonicalized to the video ID (prevents open redirects)
- Invalid inputs go to `https://www.blitzsat.com/`
