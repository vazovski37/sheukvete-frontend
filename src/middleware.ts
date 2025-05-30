import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Read cookies properly using NextRequest API
  const token = req.cookies.get('token')?.value || null;
  const role = req.cookies.get('role')?.value || null;

  // Redirect to login if no token is found
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Role-based access control
  if (req.nextUrl.pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (req.nextUrl.pathname.startsWith('/waiter') && role !== 'WAITER') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (req.nextUrl.pathname.startsWith('/staff') && role !== 'STAFF') {
    return NextResponse.redirect(new URL('/', req.url));
  }

    if (req.nextUrl.pathname.startsWith('/sysadmin') && role !== 'SYSADMIN') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Allow access
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/waiter/:path*'],
};
