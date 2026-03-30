/**
 * BlitzSAT redirect gateway — exact targets (HTTPS, www host):
 *
 * | Incoming (this app)              | Status | Location header |
 * |----------------------------------|--------|-----------------|
 * | `/`                              | 302    | `https://www.blitzsat.com/` |
 * | Invalid / non-YouTube path       | 302    | `https://www.blitzsat.com/` |
 * | Valid YouTube URL or 11-char ID  | 301    | `https://www.blitzsat.com/generate/youtube/<encodeURIComponent(link)>` |
 * | `/api/redirect?url=…` (valid)    | 301    | same generator URL as above |
 * | `/api/redirect` (missing/bad)    | 302    | `https://www.blitzsat.com/` |
 *
 * `<encodeURIComponent(link)>` is the full string after encoding (e.g. ID `dQw4w9WgXcQ` → path segment `dQw4w9WgXcQ`; a full watch URL becomes percent-encoded in that one path segment).
 */
export const BLITZ_SAT_ORIGIN = "https://www.blitzsat.com" as const;

/** Homepage on BlitzSAT (trailing slash). */
export const BLITZ_SAT_HOME_URL = `${BLITZ_SAT_ORIGIN}/` as const;

/** Path on www.blitzsat.com for the YouTube → SAT generator flow. */
export const YOUTUBE_GENERATE_PATH = "/generate/youtube" as const;

const YOUTUBE_URL_PATTERNS = [
  /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/i,
  /^https?:\/\/(www\.)?youtu\.be\/[\w-]+/i,
  /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/i,
  /^https?:\/\/(www\.)?youtube\.com\/v\/[\w-]+/i,
] as const;

export function buildBlitzSatGenerateUrl(youtubeVideoLink: string): string {
  return `${BLITZ_SAT_ORIGIN}${YOUTUBE_GENERATE_PATH}/${encodeURIComponent(youtubeVideoLink)}`;
}

export function normalizeYoutubeLinkFromSegments(segments: string[]): string {
  let youtubeVideoLink = segments.join("/");
  try {
    youtubeVideoLink = decodeURIComponent(youtubeVideoLink);
  } catch {
    // keep joined string
  }
  return youtubeVideoLink;
}

export function isValidYouTubeUrl(url: string): boolean {
  if (YOUTUBE_URL_PATTERNS.some((pattern) => pattern.test(url))) {
    return true;
  }

  if (url.length === 11) {
    if (/^[A-Za-z0-9_-]{11}$/.test(url) && !/--|__|-_|_-/.test(url)) {
      const hasLetters = /[A-Za-z]/.test(url);
      const hasNumbers = /[0-9]/.test(url);
      if (hasLetters && hasNumbers) {
        return true;
      }
    }
  }

  return false;
}
