import axios from "axios";
import { parseCookies } from "nookies";

// const API_BASE_URL = "https://sheukvete.onrender.com/api";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const cookies = parseCookies();
  const token = cookies["token"]
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
