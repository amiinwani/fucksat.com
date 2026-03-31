import { redirect } from "next/navigation";
import {
  BLITZ_SAT_HOME_URL,
  buildBlitzSatGenerateUrl,
  extractYouTubeVideoId,
  normalizeYoutubeLinkFromSegments,
} from "@/lib/youtube-redirect";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Fallback when middleware does not run (e.g. local edge case). Keeps logic in sync via shared helpers.
 * Successful traffic should be redirected in middleware.ts before this renders.
 */
export default async function CatchAllPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const qs = await searchParams;

  if (!slug || slug.length === 0) {
    redirect(BLITZ_SAT_HOME_URL);
  }

  const youtubeVideoLink = normalizeYoutubeLinkFromSegments(slug);
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(qs)) {
    if (Array.isArray(value)) {
      for (const item of value) query.append(key, item);
    } else if (typeof value === "string") {
      query.append(key, value);
    }
  }
  const withQuery = query.size > 0 ? `${youtubeVideoLink}?${query.toString()}` : youtubeVideoLink;
  const videoId =
    extractYouTubeVideoId(withQuery) ??
    extractYouTubeVideoId(youtubeVideoLink) ??
    extractYouTubeVideoId(typeof qs.v === "string" ? qs.v : "");

  if (videoId) {
    redirect(buildBlitzSatGenerateUrl(videoId));
  }

  redirect(BLITZ_SAT_HOME_URL);
}
