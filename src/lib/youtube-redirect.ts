/**
 * BlitzSAT redirect gateway — exact targets (HTTPS, www host):
 *
 * | Incoming (this app)              | Status | Location header |
 * |----------------------------------|--------|-----------------|
 * | `/`                              | 302    | `https://www.blitzsat.com/` |
 * | Invalid / non-YouTube path       | 302    | `https://www.blitzsat.com/` |
 * | Valid YouTube URL or 11-char ID  | 301    | `https://www.blitzsat.com/generate/youtube/<encodeURIComponent(link)>` |
 * | `/generate/youtube/<valid>`      | pass   | Serves CurioLearn generator (iframe); invalid → 302 `/` |
 * | `/api/redirect?url=…` (valid)    | 301    | same generator URL as above |
 * | `/api/redirect` (missing/bad)    | 302    | `https://www.blitzsat.com/` |
 *
 * `<encodeURIComponent(link)>` is the full string after encoding (e.g. ID `dQw4w9WgXcQ` → path segment `dQw4w9WgXcQ`; a full watch URL becomes percent-encoded in that one path segment).
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

export function buildBlitzSatGenerateUrl(youtubeVideoLink: string): string {
  return `${BLITZ_SAT_ORIGIN}${YOUTUBE_GENERATE_PATH}/${encodeURIComponent(youtubeVideoLink)}`;
}

/** CurioLearn generator URL (iframe / same path contract as README). */
export function buildSatCurioGenerateUrl(youtubeVideoLink: string): string {
  return `${SAT_CURIOLEARN_ORIGIN}${YOUTUBE_GENERATE_PATH}/${encodeURIComponent(youtubeVideoLink)}`;
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
