/** Canonical product URLs for this redirect gateway */
export const BLITZ_SAT_ORIGIN = "https://blitzsat.com" as const;

/** Path on BlitzSAT where the YouTube generator lives (same shape as the old CurioLearn URL). */
export const YOUTUBE_GENERATE_PATH = "/generate/youtube" as const;

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
  const youtubeUrlPatterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/i,
    /^https?:\/\/(www\.)?youtu\.be\/[\w-]+/i,
    /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/i,
    /^https?:\/\/(www\.)?youtube\.com\/v\/[\w-]+/i,
  ];

  if (youtubeUrlPatterns.some((pattern) => pattern.test(url))) {
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
