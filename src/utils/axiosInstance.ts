import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";
import { parseCookies } from "nookies";
import { triggerLogout } from "@/utils/logoutHandler";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Create Axios Instances
const axiosInstance = axios.create({
  baseURL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const axiosInstanceT = axios.create({
  baseURL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
    "X-TenantID": "main",
  },
  withCredentials: true,
});

// Token Setter Interceptor (applies to both instances)
const attachTokenInterceptor = (instance: typeof axiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      const cookies = parseCookies();
      const token = cookies["token"];
      console.log(token)
      if (token) {
        // Axios v1+ uses AxiosHeaders, so mutate instead of replace
        if (
          config.headers &&
          typeof config.headers === "object" &&
          "set" in config.headers &&
          typeof config.headers.set === "function"
        ) {
          config.headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};


// Response Interceptor (handles token expiration)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message;
    if (message?.includes("Token has expired")) {
      console.warn("🔐 Token expired. Logging out...");
      triggerLogout();
    }
    return Promise.reject(error);
  }
);

// Apply request interceptors to both instances
attachTokenInterceptor(axiosInstance);
attachTokenInterceptor(axiosInstanceT);

// --- API Methods ---

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
  const cookies = parseCookies();
  const token = cookies["api_token"];

  return axios.get(url, {
    baseURL,
    responseType: "blob",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      Authorization: `Bearer ${token}`,
      Accept: acceptType,
    },
    withCredentials: true,
  }).then((res) => res.data);
};

export default axiosInstance;
