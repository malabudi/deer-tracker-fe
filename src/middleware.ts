// Without a defined matcher, this line applies next-auth to the entire project
export { default } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!token;

  // if user is authenticated and visits the root page, redirect to /settings
  if (pathname === '/' && isAuthenticated) {
    return NextResponse.redirect(new URL('/settings', req.url));
  }

  return NextResponse.next();
}

// Pages that the user cannot visit unless they login (protected pages)
export const config = {
  matcher: ['/', '/capture', '/maps', '/settings'],
};
