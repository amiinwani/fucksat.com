/**
 * BlitzSAT redirect gateway — exact targets (HTTPS, www host):
 *
 * | Incoming (this app)              | Status | Location header |
 * |----------------------------------|--------|-----------------|
 * | `/`                              | 302    | `https://www.blitzsat.com/` |
 * | Invalid / non-YouTube path       | 302    | `https://www.blitzsat.com/` |
 * | Valid YouTube URL or 11-char ID  | 301    | `https://www.blitzsat.com/generate/youtube/<videoId>` |
 * | `/generate/youtube/<valid>`      | pass   | Serves CurioLearn generator (iframe); invalid → 302 `/` |
 * | `/api/redirect?url=…` (valid)    | 301    | same generator URL as above |
 * | `/api/redirect` (missing/bad)    | 302    | `https://www.blitzsat.com/` |
 *
 * Canonical output always uses the 11-char YouTube video ID as the final path segment.
 */
export const BLITZ_SAT_ORIGIN = "https://www.blitzsat.com" as const;

/** CurioLearn SAT app — same `/generate/youtube/…` path shape as BlitzSAT. */
export const SAT_CURIOLEARN_ORIGIN = "https://sat.curiolearn.co" as const;

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
const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export function buildBlitzSatGenerateUrl(videoId: string): string {
  return `${BLITZ_SAT_ORIGIN}${YOUTUBE_GENERATE_PATH}/${encodeURIComponent(videoId)}`;
}

/** CurioLearn generator URL (iframe / same path contract as README). */
export function buildSatCurioGenerateUrl(videoId: string): string {
  return `${SAT_CURIOLEARN_ORIGIN}${YOUTUBE_GENERATE_PATH}/${encodeURIComponent(videoId)}`;
}

/**
 * If pathname is `/generate/youtube/<payload>`, returns the decoded video ref string.
 * Otherwise `null` (not under that prefix).
 */
export function getYoutubeRefFromGeneratePath(pathname: string): string | null {
  if (pathname === YOUTUBE_GENERATE_PATH) {
    return null;
  }
  if (!pathname.startsWith(`${YOUTUBE_GENERATE_PATH}/`)) {
    return null;
  }
  const encoded = pathname.slice(YOUTUBE_GENERATE_PATH.length + 1);
  if (!encoded) return null;
  try {
    return decodeURIComponent(encoded);
  } catch {
    return null;
  }
}

/** Canonical path segment for a given video ref (single path segment after `/generate/youtube/`). */
export function canonicalGenerateYoutubePathname(videoRef: string): string {
  return `${YOUTUBE_GENERATE_PATH}/${encodeURIComponent(videoRef)}`;
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

function isLikelyYouTubeVideoId(value: string): boolean {
  if (!YOUTUBE_ID_PATTERN.test(value)) return false;
  if (/--|__|-_|_-/.test(value)) return false;
  return /[A-Za-z]/.test(value) && /[0-9]/.test(value);
}

/**
 * Extracts the canonical 11-char YouTube video ID from supported inputs:
 * - plain ID (`dQw4w9WgXcQ`)
 * - watch URLs (`...watch?v=...`)
 * - youtu.be URLs
 * - embed / v URLs
 * - partially malformed path-like inputs that still contain those forms
 */
export function extractYouTubeVideoId(input: string): string | null {
  let value = input.trim();
  if (!value) return null;
  try {
    value = decodeURIComponent(value);
  } catch {
    // keep raw value
  }

  if (isLikelyYouTubeVideoId(value)) {
    return value;
  }

  const patterns = [
    /[?&]v=([A-Za-z0-9_-]{11})/i,
    /youtu\.be\/([A-Za-z0-9_-]{11})/i,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/i,
    /youtube\.com\/v\/([A-Za-z0-9_-]{11})/i,
  ] as const;

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match && isLikelyYouTubeVideoId(match[1])) {
      return match[1];
    }
  }

  return null;
}
