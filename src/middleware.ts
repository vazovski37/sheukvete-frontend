import { NextRequest, NextResponse } from 'next/server';
import { parseCookies } from 'nookies';

export function middleware(req: NextRequest) {
  const cookies = parseCookies({ req });
  const token = cookies.token;
  const role = cookies.role;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (req.nextUrl.pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/waiter/:path*'],
};
