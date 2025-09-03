import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const youtubeUrl = searchParams.get('url');
  
  if (!youtubeUrl) {
    return NextResponse.redirect(new URL('/', request.url), 302);
  }
  
  // Validate YouTube URL
  const isValidYouTubeUrl = (url: string): boolean => {
    const youtubePatterns = [
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/i,
      /^https?:\/\/(www\.)?youtu\.be\/[\w-]+/i,
      /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/i,
      /^https?:\/\/(www\.)?youtube\.com\/v\/[\w-]+/i,
      /^[\w-]{11}$/, // YouTube video ID pattern (11 characters)
    ];
    
    return youtubePatterns.some(pattern => pattern.test(url));
  };
  
  if (isValidYouTubeUrl(youtubeUrl)) {
    const curioLearnUrl = `https://sat.curiolearn.co/generate/youtube/${encodeURIComponent(youtubeUrl)}`;
    return NextResponse.redirect(curioLearnUrl, 301);
  } else {
    return NextResponse.redirect(new URL('/', request.url), 302);
  }
}
