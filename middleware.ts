import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Clean redirect to the target URL without any additional parameters
  const redirectUrl = 'https://sat.curiolearn.co/generate/khan-algebra'

  console.log('Middleware triggered for:', request.url)

  // Always redirect to the clean target URL
  return NextResponse.redirect(redirectUrl, 301)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}