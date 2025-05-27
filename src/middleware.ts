import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authToken = req.cookies.get('authToken');

  // If user is authenticated and tries to access /login, redirect to home
  if (authToken && pathname === '/login') {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // If user is not authenticated and tries to access any route except /login, redirect to /login
  if (!authToken && pathname !== '/login') {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Otherwise, continue
  return NextResponse.next();
}

// Optionally, specify the matcher if using Next.js middleware config
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};