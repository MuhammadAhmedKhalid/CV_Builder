import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle CORS for cookie-based authentication
  const response = NextResponse.next();
  
  // Set CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    response.headers.set(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200 });
  }

  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};