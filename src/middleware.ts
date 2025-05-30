// src/middleware.ts

import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value || null;
  const restaurantJwt = req.cookies.get('RESTAURANT_JWT')?.value || null;
  const role = req.cookies.get('role')?.value || null;

  const isSysAdminPath = req.nextUrl.pathname.startsWith('/sysadmin');
  const isProtectedInternalPath = req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/waiter') || req.nextUrl.pathname.startsWith('/staff') || req.nextUrl.pathname.startsWith('/kitchen');

  if (isSysAdminPath && !restaurantJwt) {
    console.log(`${new Date().toLocaleString()} [Middleware] Sysadmin path, no RESTAURANT_JWT. Redirecting to login.`);
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // CRITICAL: Check for 'token' here now that frontend sets it
  if (isProtectedInternalPath && !token) {
    console.log(`${new Date().toLocaleString()} [Middleware] Protected internal path, no user 'token' cookie found. Redirecting to login.`);
    // Log available cookies for deeper debugging if still failing
    // console.log(`${new Date().toLocaleString()} [Middleware] Request Cookies:`, Object.fromEntries(req.cookies.entries()));
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Role-based access control (only if a relevant token is present)
  if (role) {
    if (req.nextUrl.pathname.startsWith('/admin') && role !== 'ADMIN') {
      console.log(`${new Date().toLocaleString()} [Middleware] Unauthorized role (${role}) for /admin path.`);
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (req.nextUrl.pathname.startsWith('/waiter') && role !== 'WAITER') {
      console.log(`${new Date().toLocaleString()} [Middleware] Unauthorized role (${role}) for /waiter path.`);
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (req.nextUrl.pathname.startsWith('/staff') && role !== 'STAFF') {
      console.log(`${new Date().toLocaleString()} [Middleware] Unauthorized role (${role}) for /staff path.`);
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (req.nextUrl.pathname.startsWith('/kitchen') && role !== 'KITCHEN') {
        console.log(`${new Date().toLocaleString()} [Middleware] Unauthorized role (${role}) for /kitchen path.`);
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (req.nextUrl.pathname.startsWith('/sysadmin') && role !== 'SYSTEMADMIN') {
      console.log(`${new Date().toLocaleString()} [Middleware] Unauthorized role (${role}) for /sysadmin path.`);
      return NextResponse.redirect(new URL('/', req.url));
    }
  } else {
      // If role is null but it's a protected path, redirect.
      // This catches cases where the token might be there but the role cookie isn't (or is invalid).
      if (isProtectedInternalPath || isSysAdminPath) {
          console.log(`${new Date().toLocaleString()} [Middleware] No role cookie found for protected route, or token is missing. Redirecting to login.`);
          return NextResponse.redirect(new URL('/login', req.url));
      }
  }

  // Allow access
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/waiter/:path*', '/staff/:path*', '/sysadmin/:path*', '/kitchen/:path*'],
};