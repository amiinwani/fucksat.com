import { NextRequest, NextResponse } from "next/server";
import {
  BLITZ_SAT_ORIGIN,
  buildBlitzSatGenerateUrl,
  isValidYouTubeUrl,
} from "@/lib/youtube-redirect";

export const runtime = "edge";

/**
 * Query-style redirect: /api/redirect?url=<youtube url or id>
 * 301: valid YouTube target (browser may cache)
 * 302: missing/invalid → BlitzSAT homepage
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const youtubeUrl = searchParams.get("url");

  if (!youtubeUrl) {
    return NextResponse.redirect(new URL("/", BLITZ_SAT_ORIGIN), 302);
  }

  if (isValidYouTubeUrl(youtubeUrl)) {
    return NextResponse.redirect(buildBlitzSatGenerateUrl(youtubeUrl), 301);
  }

  return NextResponse.redirect(new URL("/", BLITZ_SAT_ORIGIN), 302);
}
