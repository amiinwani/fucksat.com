import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  BLITZ_SAT_ORIGIN,
  buildBlitzSatGenerateUrl,
  isValidYouTubeUrl,
  normalizeYoutubeLinkFromSegments,
} from "@/lib/youtube-redirect";

/**
 * Edge middleware runs before any Server Components / RSC payload.
 * Redirects here avoid rendering the catch-all page and heavy layout work on redirect paths.
 *
 * Status codes:
 * - 301: valid YouTube URL or ID → BlitzSAT generator (cacheable; repeat visits skip this origin)
 * - 302: `/` or invalid path → BlitzSAT homepage
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/", BLITZ_SAT_ORIGIN), 302);
  }

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return NextResponse.redirect(new URL("/", BLITZ_SAT_ORIGIN), 302);
  }

  const youtubeVideoLink = normalizeYoutubeLinkFromSegments(segments);

  if (isValidYouTubeUrl(youtubeVideoLink)) {
    return NextResponse.redirect(buildBlitzSatGenerateUrl(youtubeVideoLink), 301);
  }

  return NextResponse.redirect(new URL("/", BLITZ_SAT_ORIGIN), 302);
}

export const config = {
  matcher: [
    "/",
    /*
     * Skip: static files, Next internals — everything else hits middleware.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|txt|xml|json|webmanifest)$).*)",
  ],
};
