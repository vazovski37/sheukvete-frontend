// src/features/auth/api.ts

import API_ROUTES from "@/constants/apiRoutes";
import { LoginRequest, LoginResponse } from "@/features/auth/types";
import { apiTPost, apiPost } from "@/utils/axiosInstance";

export async function login({ username, password }: LoginRequest): Promise<LoginResponse> {
  const data = await apiTPost(API_ROUTES.AUTH.LOGIN, { username, password });
  return data as LoginResponse;
}

export async function generalLogin({ username, password }: LoginRequest): Promise<LoginResponse> {
  // Assuming the backend still returns a 'token' in the JSON body for generalLogin
  const data = await apiPost(API_ROUTES.AUTH.LOGIN_GENERAL, { username, password });
  return data as LoginResponse;
}