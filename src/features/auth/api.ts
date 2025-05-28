import API_ROUTES from "@/constants/apiRoutes";
import { LoginRequest, LoginResponse } from "@/features/auth/types";
import { apiTPost, apiPost } from "@/utils/axiosInstance";

export async function login({ username, password }: LoginRequest): Promise<LoginResponse> {
  const data = await apiTPost(API_ROUTES.AUTH.LOGIN, { username, password });
  return data as LoginResponse;
}

export async function generalLogin({ username, password }: LoginRequest): Promise<LoginResponse> {
  const data = await apiPost(API_ROUTES.AUTH.LOGIN_GENERAL, { username, password });
  return data as LoginResponse;
}

