import { redirect } from "next/navigation";
import {
  BLITZ_SAT_ORIGIN,
  buildBlitzSatGenerateUrl,
  isValidYouTubeUrl,
  normalizeYoutubeLinkFromSegments,
} from "@/lib/youtube-redirect";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

/**
 * Fallback when middleware does not run (e.g. local edge case). Keeps logic in sync via shared helpers.
 * Successful traffic should be redirected in middleware.ts before this renders.
 */
export default async function CatchAllPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    redirect(BLITZ_SAT_ORIGIN);
  }

  const youtubeVideoLink = normalizeYoutubeLinkFromSegments(slug);

  if (isValidYouTubeUrl(youtubeVideoLink)) {
    redirect(buildBlitzSatGenerateUrl(youtubeVideoLink));
  }

  redirect(BLITZ_SAT_ORIGIN);
}
