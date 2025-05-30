// src/utils/axiosInstance.ts

import axios, { AxiosRequestConfig } from "axios";
import { triggerLogout } from "@/utils/logoutHandler"; //

const PROXY_BASE_URL = "/api/proxy";

// axiosInstance: Used for most user-level authenticated calls (implicitly uses "token" cookie)
const axiosInstance = axios.create({
  baseURL: PROXY_BASE_URL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
  },
  withCredentials: true, // Crucial for sending HttpOnly cookies to the proxy
});

// axiosInstanceT: Used by apiTPost for the initial restaurant/sysadmin login call.
// It does NOT send any token, as the initial login is public.
// Its X-TenantID header will be forwarded by the proxy.
const axiosInstanceT = axios.create({
  baseURL: PROXY_BASE_URL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
    "X-TenantID": "main", // This header will be forwarded by the proxy
  },
  withCredentials: true, // Crucial for sending HttpOnly cookies to the proxy
});

// Response Interceptor (handles token expiration from backend response)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message;
    // Check for expiration of the user-level "token"
    if (message?.includes("Token has expired")) {
      console.warn("🔐 User-level token expired. Logging out...");
      triggerLogout();
    }
    return Promise.reject(error);
  }
);

// Apply response interceptor to axiosInstanceT as well, for its specific use case (though it's less likely to receive token expiry for the initial login response itself)
axiosInstanceT.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message;
    // Check for expiration of RESTAURANT_JWT if backend sends specific message for it
    if (message?.includes("RESTAURANT_JWT expired") || message?.includes("Token has expired")) {
      console.warn("🔐 RESTAURANT_JWT or generic token expired. Logging out...");
      // Trigger logout handler to clear both relevant cookies
      triggerLogout(); // This handler should clear both "token" and "RESTAURANT_JWT"
    }
    return Promise.reject(error);
  }
);


// --- API Methods ---
// These methods will now automatically send requests to /api/proxy.
// The proxy will determine which HttpOnly cookie to attach based on the route.
export const apiTPost = async (url: string, data?: any): Promise<any> => {
  return axiosInstanceT.post(url, data).then((res) => res.data);
};

export const apiPost = async (url: string, data?: any): Promise<any> => {
  return axiosInstance.post(url, data).then((res) => res.data);
};

export const apiGet = async <T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
  return axiosInstance.get<T>(url, { ...config, params }).then((res) => res.data);
};

export const apiPut = async (url: string, data?: any): Promise<any> => {
  return axiosInstance.put(url, data).then((res) => res.data);
};

export const apiDelete = async (url: string, dataOrConfig?: any): Promise<any> => {
  const config = dataOrConfig?.data
    ? dataOrConfig
    : dataOrConfig
    ? { data: dataOrConfig }
    : undefined;

  return axiosInstance.delete(url, config).then((res) => res.data);
};

export const apiGetBlob = async (
  url: string,
  acceptType: string = "application/pdf"
): Promise<Blob> => {
  return axiosInstance.get(url, {
    responseType: "blob",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      Accept: acceptType,
    },
  }).then((res) => res.data);
};

export default axiosInstance;