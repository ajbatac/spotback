
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware is largely superseded by client-side logic in AuthProvider,
// but it can be kept for defense-in-depth or server-side route protection.
// For now, we'll simplify it as the primary logic is now in the client.

export function middleware(request: NextRequest) {
  // The client-side AuthProvider now handles redirection.
  // Middleware can be used for things like blocking API routes if a token cookie isn't present,
  // but for UI pages, client-side redirection provides a better user experience
  // without a flash of unauthenticated content.
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/login'],
};
    