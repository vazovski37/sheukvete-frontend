// src/features/auth/api.ts

import API_ROUTES from "@/constants/apiRoutes"; //
import { LoginRequest, LoginResponse } from "@/features/auth/types"; //
import { apiTPost, apiPost } from "@/utils/axiosInstance"; //

export async function login({ username, password }: LoginRequest): Promise<LoginResponse> {
  // This call (to /auth/login) is the first login, it does NOT send any token.
  // apiTPost uses axiosInstanceT which does not have an auth interceptor
  const data = await apiTPost(API_ROUTES.AUTH.LOGIN, { username, password });
  return data as LoginResponse;
}

export async function generalLogin({ username, password }: LoginRequest): Promise<LoginResponse> {
  // This call (to /auth/general/login) requires RESTAURANT_JWT.
  // We use apiPost (which implicitly routes through /api/proxy),
  // and the proxy itself is now smart enough to detect this route
  // and attach the RESTAURANT_JWT cookie from the request.
  const data = await apiPost(API_ROUTES.AUTH.LOGIN_GENERAL, { username, password });
  return data as LoginResponse;
}