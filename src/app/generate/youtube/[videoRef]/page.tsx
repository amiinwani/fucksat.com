import { redirect } from "next/navigation";
import {
  BLITZ_SAT_HOME_URL,
  buildSatCurioGenerateUrl,
  isValidYouTubeUrl,
} from "@/lib/youtube-redirect";

interface PageProps {
  params: Promise<{
    videoRef: string;
  }>;
}

/**
 * Canonical BlitzSAT URLs `/generate/youtube/<id|encoded url>` load the CurioLearn
 * generator here so the address bar stays on www.blitzsat.com.
 */
export default async function GenerateYoutubePage({ params }: PageProps) {
  const { videoRef: rawSegment } = await params;
  let videoRef: string;
  try {
    videoRef = decodeURIComponent(rawSegment);
  } catch {
    redirect(BLITZ_SAT_HOME_URL);
  }

  if (!isValidYouTubeUrl(videoRef)) {
    redirect(BLITZ_SAT_HOME_URL);
  }

  const src = buildSatCurioGenerateUrl(videoRef);

  return (
    <iframe
      title="SAT YouTube practice generator"
      src={src}
      className="fixed inset-0 h-[100dvh] w-full border-0"
      allow="clipboard-write; fullscreen"
    />
  );
}
