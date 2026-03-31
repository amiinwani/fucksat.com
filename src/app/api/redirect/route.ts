import { NextRequest, NextResponse } from "next/server";
import {
  BLITZ_SAT_HOME_URL,
  buildBlitzSatGenerateUrl,
  extractYouTubeVideoId,
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
    return NextResponse.redirect(BLITZ_SAT_HOME_URL, 302);
  }

  const videoId = extractYouTubeVideoId(youtubeUrl);
  if (videoId) {
    return NextResponse.redirect(buildBlitzSatGenerateUrl(videoId), 301);
  }

  return NextResponse.redirect(BLITZ_SAT_HOME_URL, 302);
}
