import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function YouTubeRedirect({ params }: PageProps) {
  const { slug } = await params;
  
  // Join the slug array to recreate the original path
  const originalPath = slug.join('/');
  
  // Function to extract YouTube video ID from various URL formats
  function getYouTubeVideoId(url: string): string | null {
    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/watch\?.*&v=)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  }
  
  // Function to check if the URL is a YouTube URL
  function isYouTubeUrl(url: string): boolean {
    return /(?:youtube\.com|youtu\.be)/i.test(url) || /^[a-zA-Z0-9_-]{11}$/.test(url);
  }
  
  // Decode URL components in case they are encoded
  const decodedPath = decodeURIComponent(originalPath);
  
  // Check if this looks like a YouTube URL or video ID
  if (isYouTubeUrl(decodedPath)) {
    // Try to extract video ID
    const videoId = getYouTubeVideoId(decodedPath);
    
    if (videoId) {
      // Construct the full YouTube URL for the redirect
      const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const redirectUrl = `https://sat.curiolearn.co/generate/youtube/${encodeURIComponent(youtubeUrl)}`;
      
      redirect(redirectUrl);
    }
  }
  
  // If the path contains a full YouTube URL, use it directly
  if (decodedPath.includes('youtube.com') || decodedPath.includes('youtu.be')) {
    // If it's already a full URL, use it as is
    let youtubeUrl = decodedPath;
    
    // Ensure it starts with https://
    if (!youtubeUrl.startsWith('http')) {
      youtubeUrl = `https://${youtubeUrl}`;
    }
    
    const redirectUrl = `https://sat.curiolearn.co/generate/youtube/${encodeURIComponent(youtubeUrl)}`;
    redirect(redirectUrl);
  }
  
  // If we can't identify it as a YouTube URL, still try to redirect
  // in case it's a different format we didn't account for
  const redirectUrl = `https://sat.curiolearn.co/generate/youtube/${encodeURIComponent(decodedPath)}`;
  redirect(redirectUrl);
}
