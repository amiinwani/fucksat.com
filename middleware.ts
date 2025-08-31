import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Target URL to redirect to
  const redirectUrl = 'https://sat.cuirolearn.co/generate/khan-algebra'
  
  // Redirect all requests to the target URL
  return NextResponse.redirect(redirectUrl, 301) // 301 = permanent redirect
}

// Configure which paths should trigger the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths including root
     */
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
