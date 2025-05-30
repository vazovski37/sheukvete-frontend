// src/app/api/proxy/[...path]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
// import { parseCookies } from 'nookies'; // We will bypass nookies for direct extraction
import API_ROUTES from '@/constants/apiRoutes';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const PUBLIC_ROUTES = [
  API_ROUTES.AUTH.LOGIN,
];

// Helper function to manually parse cookies from the request header
function parseCookiesManual(request: NextRequest): Record<string, string> {
  const cookieHeader = request.headers.get('Cookie');
  const cookies: Record<string, string> = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      if (parts.length > 1) {
        const name = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        cookies[name] = value;
      }
    });
  }
  return cookies;
}


// Define each HTTP method handler directly as a named export
export async function GET(req: NextRequest) {
  return handleRequest(req);
}

export async function POST(req: NextRequest) {
  return handleRequest(req);
}

export async function PUT(req: NextRequest) {
  return handleRequest(req);
}

export async function DELETE(req: NextRequest) {
  return handleRequest(req);
}

export async function PATCH(req: NextRequest) {
  return handleRequest(req);
}

export async function OPTIONS(req: NextRequest) {
  return handleRequest(req);
}

export async function HEAD(req: NextRequest) {
  return handleRequest(req);
}

async function handleRequest(req: NextRequest) {
  const pathSegments = req.nextUrl.pathname.split('/api/proxy/').slice(1);
  const targetPath = pathSegments.join('/');

  console.log(`${new Date().toLocaleString()} [Proxy] Incoming request: ${req.method} /api/proxy/${targetPath}`);
  console.log(`${new Date().toLocaleString()} [Proxy] Target Backend URL Base: ${BACKEND_API_URL}`);

  try {
    const requestHeaders = new Headers(req.headers);
    // Use manual cookie parsing instead of nookies
    const cookies = parseCookiesManual(req);

    // IMPORTANT: Log all cookies visible to the proxy *after manual parsing*
    console.log(`${new Date().toLocaleString()} [Proxy] All cookies visible to proxy (manual parse):`, cookies);

    const isPublicRoute = PUBLIC_ROUTES.some(route => targetPath.endsWith(route.replace(/^\//, '')));
    const isGeneralLoginRoute = targetPath.endsWith(API_ROUTES.AUTH.LOGIN_GENERAL.replace(/^\//, ''));
    const isSysAdminRoute = targetPath.startsWith(API_ROUTES.SYSADMIN.RESTAURANTS.BASE.replace(/^\//, ''));

    let authorizationHeaderValue: string | undefined;

    if (isPublicRoute) {
      console.log(`${new Date().toLocaleString()} [Proxy] Bypassing token attachment for public route: ${targetPath}`);
    } else if (isGeneralLoginRoute || isSysAdminRoute) {
      const restaurantJwt = cookies['RESTAURANT_JWT'];
      if (!restaurantJwt) {
        console.warn(`${new Date().toLocaleString()} [Proxy] RESTAURANT_JWT missing from parsed cookies for route: ${targetPath}`);
        return NextResponse.json({ message: 'RESTAURANT_JWT token missing.' }, { status: 401 });
      }
      console.log(`${new Date().toLocaleString()} [Proxy] Attaching RESTAURANT_JWT for route: ${targetPath}`);
      authorizationHeaderValue = `Bearer ${restaurantJwt}`;
    } else {
      const userToken = cookies['token'];
      if (!userToken) {
        console.warn(`${new Date().toLocaleString()} [Proxy] User-level "token" missing from parsed cookies for protected route: ${targetPath}`);
        return NextResponse.json({ message: 'Authentication token missing.' }, { status: 401 });
      }
      console.log(`${new Date().toLocaleString()} [Proxy] Attaching user-level "token" for protected route: ${targetPath}`);
      authorizationHeaderValue = `Bearer ${userToken}`;
    }

    // Prepare headers to forward to the backend
    const forwardedHeaders: Record<string, string> = {};

    // Copy all original request headers, EXCEPT for 'host' and 'authorization'
    for (const [key, value] of requestHeaders.entries()) {
      if (key.toLowerCase() !== 'host' && key.toLowerCase() !== 'authorization') {
        forwardedHeaders[key] = value;
      }
    }

    // Add or override the Authorization header if a token was determined
    if (authorizationHeaderValue) {
        forwardedHeaders['Authorization'] = authorizationHeaderValue;
    }
    // Also ensure Content-Type is set if it was originally
    if (!forwardedHeaders['Content-Type'] && requestHeaders.get('Content-Type')) {
        forwardedHeaders['Content-Type'] = requestHeaders.get('Content-Type') as string;
    }


    const method = req.method;
    let requestBody = undefined;
    if (method !== 'GET' && method !== 'HEAD' && req.headers.get('content-length') !== '0') {
      try {
        requestBody = await req.json();
        console.log(`${new Date().toLocaleString()} [Proxy] Request body:`, requestBody);
      } catch (error) {
        console.warn(`${new Date().toLocaleString()} [Proxy] Could not parse request body as JSON (might be empty or non-JSON):`, error);
      }
    }

    const backendUrl = new URL(`${BACKEND_API_URL}/${targetPath}`);
    req.nextUrl.searchParams.forEach((value, key) => {
      backendUrl.searchParams.append(key, value);
    });
    console.log(`${new Date().toLocaleString()} [Proxy] Full backend URL:`, backendUrl.toString());
    console.log(`${new Date().toLocaleString()} [Proxy] Headers being sent to backend:`, forwardedHeaders);

    console.log(`${new Date().toLocaleString()} [Proxy] Attempting to forward request to backend...`);
    const backendResponse = await axios({
      method: method,
      url: backendUrl.toString(),
      headers: forwardedHeaders,
      data: requestBody,
      validateStatus: (status) => true,
    });

    console.log(`${new Date().toLocaleString()} [Proxy] Backend response status: ${backendResponse.status}`);
    console.log(`${new Date().toLocaleString()} [Proxy] Backend response data:`, backendResponse.data);

    const responseHeaders = new Headers();
    backendResponse.headers['set-cookie']?.forEach((cookie: string) => {
      responseHeaders.append('Set-Cookie', cookie);
    });

    if (backendResponse.headers['content-type']) {
      responseHeaders.set('Content-Type', backendResponse.headers['content-type']);
    }

    return new NextResponse(JSON.stringify(backendResponse.data), {
      status: backendResponse.status,
      headers: responseHeaders,
    });

  } catch (error: any) {
    console.error(`${new Date().toLocaleString()} [Proxy] CRITICAL ERROR IN PROXY ROUTE:`, error);
    if (axios.isAxiosError(error) && error.response) {
      console.error(`${new Date().toLocaleString()} [Proxy] Backend API error details:`, error.response.status, error.response.data);

      const errorResponseHeaders = new Headers();
      if (error.response.headers['set-cookie']) {
        error.response.headers['set-cookie'].forEach((cookie: string) => {
          errorResponseHeaders.append('Set-Cookie', cookie);
        });
      }
      if (error.response.headers['content-type']) {
        errorResponseHeaders.set('Content-Type', error.response.headers['content-type']);
      }

      return new NextResponse(JSON.stringify(error.response.data), {
        status: error.response.status,
        headers: errorResponseHeaders,
      });
    }
    return NextResponse.json({ message: 'API proxy encountered an unexpected internal error.' }, { status: 500 });
  }
}