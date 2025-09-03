import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  if (!slug || slug.length === 0) {
    return {
      title: "SAT Speedrun - AI-Powered SAT Prep Platform | CurioLearn",
      description: "Speedrun your SAT prep in days with AI that transforms any content into targeted practice.",
    };
  }
  
  // Join the slug parts to reconstruct the YouTube URL
  let youtubeVideoLink = slug.join('/');
  
  // Try to decode the URL if it's URL-encoded
  try {
    const decodedLink = decodeURIComponent(youtubeVideoLink);
    youtubeVideoLink = decodedLink;
  } catch {
    // URL decoding failed, use original
  }
  
  return {
    title: `Generate SAT Questions from YouTube Video | SAT Speedrun`,
    description: `Transform this YouTube video into targeted SAT practice questions instantly with our AI-powered speedrun platform.`,
    openGraph: {
      title: `Generate SAT Questions from YouTube Video | SAT Speedrun`,
      description: `Transform this YouTube video into targeted SAT practice questions instantly with our AI-powered speedrun platform.`,
      url: `https://sat.curiolearn.co/${encodeURIComponent(youtubeVideoLink)}`,
    },
    twitter: {
      title: `Generate SAT Questions from YouTube Video | SAT Speedrun`,
      description: `Transform this YouTube video into targeted SAT practice questions instantly.`,
    },
  };
}

export default async function CatchAllPage({ params }: PageProps) {
  const { slug } = await params;
  
  if (!slug || slug.length === 0) {
    redirect('/');
  }
  
  // Join the slug parts to reconstruct the YouTube URL
  let youtubeVideoLink = slug.join('/');
  
  // Try to decode the URL if it's URL-encoded
  try {
    const decodedLink = decodeURIComponent(youtubeVideoLink);
    youtubeVideoLink = decodedLink;
  } catch {
    // URL decoding failed, use original
  }
  
  // Validate YouTube URL
  const isValidYouTubeUrl = (url: string): boolean => {
    // First check if it's a full YouTube URL
    const youtubeUrlPatterns = [
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/i,
      /^https?:\/\/(www\.)?youtu\.be\/[\w-]+/i,
      /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/i,
      /^https?:\/\/(www\.)?youtube\.com\/v\/[\w-]+/i,
    ];
    
    if (youtubeUrlPatterns.some(pattern => pattern.test(url))) {
      return true;
    }
    
    // For video IDs, check if it's exactly 11 characters and follows YouTube ID pattern
    if (url.length === 11) {
      // YouTube IDs typically start with letters and contain a mix of letters, numbers, hyphens, and underscores
      // They don't typically contain consecutive hyphens or underscores
      if (/^[A-Za-z0-9_-]{11}$/.test(url) && !/--|__|-_|_-/.test(url)) {
        // Additional check: YouTube IDs typically have a good mix of characters
        const hasLetters = /[A-Za-z]/.test(url);
        const hasNumbers = /[0-9]/.test(url);
        
        if (hasLetters && hasNumbers) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  if (isValidYouTubeUrl(youtubeVideoLink)) {
    const curioLearnUrl = `https://sat.curiolearn.co/generate/youtube/${encodeURIComponent(youtubeVideoLink)}`;
    redirect(curioLearnUrl);
  } else {
    redirect('/');
  }
}
