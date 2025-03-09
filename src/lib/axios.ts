import axios from "axios";
import { parseCookies } from "nookies";

const API_BASE_URL = "https://sheukvete.onrender.com/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const cookies = parseCookies();
  const token = cookies.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
