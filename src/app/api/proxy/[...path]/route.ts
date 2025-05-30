// src/app/api/proxy/[...path]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { parseCookies } from 'nookies'; //
import API_ROUTES from '@/constants/apiRoutes'; //

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// List of routes that do NOT require any authentication token in the Authorization header
const PUBLIC_ROUTES = [
  API_ROUTES.AUTH.LOGIN, // The very first login (Restaurant/SysAdmin)
  // No other public routes should be here if they are behind any auth
];

export async function handler(req: NextRequest) {
  const pathSegments = req.nextUrl.pathname.split('/api/proxy/').slice(1);
  const targetPath = pathSegments.join('/');

  console.log(`[Proxy] Incoming request: ${req.method} /api/proxy/${targetPath}`);
  console.log(`[Proxy] Target Backend URL Base: ${BACKEND_API_URL}`);

  try {
    const headers = new Headers(req.headers);
    const cookies = parseCookies({ req }); // Parse all cookies from the incoming request

    // Logic to determine which token (if any) to attach
    const isPublicRoute = PUBLIC_ROUTES.some(route => targetPath.endsWith(route.replace(/^\//, '')));
    const isGeneralLoginRoute = targetPath.endsWith(API_ROUTES.AUTH.LOGIN_GENERAL.replace(/^\//, ''));

    if (isPublicRoute) {
      console.log(`[Proxy] Bypassing token attachment for public route: ${targetPath}`);
    } else if (isGeneralLoginRoute) {
      // For general login, we need the RESTAURANT_JWT
      const restaurantJwt = cookies['RESTAURANT_JWT'];
      if (!restaurantJwt) {
        console.warn('[Proxy] RESTAURANT_JWT missing for general login attempt.');
        return NextResponse.json({ message: 'RESTAURANT_JWT token missing.' }, { status: 401 });
      }
      console.log(`[Proxy] Attaching RESTAURANT_JWT for general login.`);
      headers.set('Authorization', `Bearer ${restaurantJwt}`);
    } else {
      // For all other protected routes, we need the user-level "token"
      const userToken = cookies['token'];
      if (!userToken) {
        console.warn('[Proxy] User-level "token" missing for protected route.');
        return NextResponse.json({ message: 'Authentication token missing.' }, { status: 401 });
      }
      console.log(`[Proxy] Attaching user-level "token" for protected route.`);
      headers.set('Authorization', `Bearer ${userToken}`);
    }

    // Clean up headers
    headers.delete('host');
    headers.delete('cookie');

    const method = req.method;
    let requestBody = undefined;
    if (method !== 'GET' && method !== 'HEAD') {
      try {
        requestBody = await req.json();
        console.log(`[Proxy] Request body:`, requestBody);
      } catch (error) {
        console.warn('[Proxy] Could not parse request body as JSON or body is empty (might be fine):', error);
      }
    }

    const backendUrl = new URL(`${BACKEND_API_URL}/${targetPath}`);
    req.nextUrl.searchParams.forEach((value, key) => {
      backendUrl.searchParams.append(key, value);
    });
    console.log(`[Proxy] Full backend URL:`, backendUrl.toString());

    console.log(`[Proxy] Attempting to forward request to backend...`);
    const backendResponse = await axios({
      method: method,
      url: backendUrl.toString(),
      headers: Object.fromEntries(headers.entries()),
      data: requestBody,
      validateStatus: (status) => true,
    });

    console.log(`[Proxy] Backend response status: ${backendResponse.status}`);
    console.log(`[Proxy] Backend response data:`, backendResponse.data);

    // --- IMPORTANT: FORWARD ALL Set-Cookie HEADERS ---
    const responseHeaders = new Headers();
    backendResponse.headers['set-cookie']?.forEach((cookie: string) => {
      responseHeaders.append('Set-Cookie', cookie);
    });

    // Also forward other relevant response headers if needed
    if (backendResponse.headers['content-type']) {
      responseHeaders.set('Content-Type', backendResponse.headers['content-type']);
    }

    return new NextResponse(JSON.stringify(backendResponse.data), {
      status: backendResponse.status,
      headers: responseHeaders,
    });

  } catch (error: any) {
    console.error('[Proxy] CRITICAL ERROR IN PROXY ROUTE:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('[Proxy] Backend API error details:', error.response.status, error.response.data);

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

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
export const OPTIONS = handler;
export const HEAD = handler;