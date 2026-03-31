import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  BLITZ_SAT_HOME_URL,
  BLITZ_SAT_ORIGIN,
  buildBlitzSatGenerateUrl,
  canonicalGenerateYoutubePathname,
  extractYouTubeVideoId,
  getYoutubeRefFromGeneratePath,
  normalizeYoutubeLinkFromSegments,
  YOUTUBE_GENERATE_PATH,
} from "@/lib/youtube-redirect";

/**
 * Edge middleware: redirect before RSC / React — smallest hot path.
 *
 * 301 → valid YouTube → `https://www.blitzsat.com/generate/youtube/<videoId>`
 * 302 → `/` or invalid → `https://www.blitzsat.com/`
 *
 * Paths already under `/generate/youtube/<payload>` are validated on the payload only
 * (not the whole string `generate/youtube/…`, which wrongly failed validation before).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    return NextResponse.redirect(BLITZ_SAT_HOME_URL, 302);
  }

  if (pathname === YOUTUBE_GENERATE_PATH) {
    return NextResponse.redirect(BLITZ_SAT_HOME_URL, 302);
  }

  if (pathname.startsWith(`${YOUTUBE_GENERATE_PATH}/`)) {
    const videoRef = getYoutubeRefFromGeneratePath(pathname);
    const videoId = videoRef ? extractYouTubeVideoId(videoRef) : null;
    if (!videoId) {
      return NextResponse.redirect(BLITZ_SAT_HOME_URL, 302);
    }
    const canonicalPath = canonicalGenerateYoutubePathname(videoId);
    if (pathname !== canonicalPath) {
      return NextResponse.redirect(new URL(canonicalPath, BLITZ_SAT_ORIGIN), 301);
    }
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return NextResponse.redirect(BLITZ_SAT_HOME_URL, 302);
  }

  const youtubeVideoLink = normalizeYoutubeLinkFromSegments(segments);
  const withQuery = request.nextUrl.search
    ? `${youtubeVideoLink}${request.nextUrl.search}`
    : youtubeVideoLink;
  const videoId =
    extractYouTubeVideoId(withQuery) ??
    extractYouTubeVideoId(youtubeVideoLink) ??
    extractYouTubeVideoId(request.nextUrl.searchParams.get("v") ?? "");

  if (videoId) {
    return NextResponse.redirect(buildBlitzSatGenerateUrl(videoId), 301);
  }

  return NextResponse.redirect(BLITZ_SAT_HOME_URL, 302);
}

export const config = {
  matcher: [
    "/",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|txt|xml|json|webmanifest)$).*)",
  ],
};
