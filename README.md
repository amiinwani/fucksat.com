# YouTube to CurioLearn Redirect Service

This Next.js application provides a redirect service that takes YouTube video links and redirects them to CurioLearn's YouTube generator platform.

## How it Works

When someone visits `yourdomain.com/[youtubevideolink]`, they are automatically redirected to `https://sat.curiolearn.co/generate/youtube/[youtubevideolink]`.

## Features

- ✅ **Automatic Redirect**: Seamlessly redirects YouTube links to CurioLearn
- ✅ **URL Encoding**: Properly handles special characters in URLs
- ✅ **Multiple YouTube Formats**: Supports various YouTube URL formats:
  - `https://youtube.com/watch?v=VIDEO_ID`
  - `https://www.youtube.com/watch?v=VIDEO_ID`
  - `https://youtu.be/VIDEO_ID`
  - `https://youtube.com/embed/VIDEO_ID`
  - `https://youtube.com/v/VIDEO_ID`
  - Just the video ID (e.g., `dQw4w9WgXcQ`)
- ✅ **Edge Case Handling**: Manages URLs with additional parameters (timestamps, playlists, etc.)
- ✅ **Validation**: Validates YouTube link patterns before redirecting
- ✅ **Fallback**: Invalid links redirect to the home page

## Implementation Details

### Catch-All Route (`src/app/[...slug]/page.tsx`)
The main redirect logic is handled by a catch-all route that:
- Captures all non-root paths
- Reconstructs the YouTube URL from the slug parts
- Handles URL decoding for encoded URLs
- Validates YouTube URLs using multiple patterns
- Redirects valid URLs to CurioLearn
- Redirects invalid URLs to the home page

### URL Validation
The service validates YouTube URLs using multiple criteria:
1. **Full YouTube URLs**: Matches standard YouTube URL patterns
2. **Video IDs**: Must be exactly 11 characters with a mix of letters and numbers
3. **Character Validation**: Ensures proper YouTube ID character patterns

### Next.js Config (`next.config.ts`)
Simple configuration without redirects to let the catch-all route handle everything.

## Usage Examples

```
# YouTube Video ID (recommended)
yourdomain.com/dQw4w9WgXcQ
→ https://sat.curiolearn.co/generate/youtube/dQw4w9WgXcQ

# URL-encoded full YouTube URL
yourdomain.com/https%3A%2F%2Fyoutube.com%2Fwatch%3Fv%3DdQw4w9WgXcQ
→ https://sat.curiolearn.co/generate/youtube/https%3A%2F%2Fyoutube.com%2Fwatch%3Fv%3DdQw4w9WgXcQ

# Invalid URL
yourdomain.com/invalid-url
→ yourdomain.com/ (redirects to home page)
```

## Edge Cases Handled

1. **URL Encoding**: Special characters like `&`, `=`, `?` are properly encoded
2. **Multiple Parameters**: URLs with timestamps, playlists, etc. are preserved
3. **Invalid Links**: Non-YouTube links redirect to the home page
4. **Empty Paths**: Root path (`/`) shows the main page
5. **Static Files**: Images, CSS, JS files are not affected by redirects
6. **Video ID Validation**: Only valid YouTube video IDs are accepted

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

The implementation has been tested with various YouTube URL formats and edge cases:
- ✅ Full YouTube URLs (URL-encoded)
- ✅ YouTube Video IDs (11 characters)
- ✅ URLs with additional parameters
- ✅ Special characters
- ✅ Invalid URLs (fallback behavior)

## Security Considerations

- Only YouTube URLs are redirected to CurioLearn
- Invalid URLs redirect to the home page instead of external sites
- URL encoding prevents injection attacks
- Strict validation prevents malicious redirects
- Video ID validation ensures only legitimate YouTube IDs are accepted
