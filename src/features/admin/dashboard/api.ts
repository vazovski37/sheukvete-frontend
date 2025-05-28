// src/features/admin/dashboard/api.ts

import { apiGet } from "@/utils/axiosInstance"; // This apiGet is now generic
import API_ROUTES from "@/constants/apiRoutes";
import type { AdminDashboardStats } from "./types";
import type { FinanceFilter } from "@/features/admin/finances/types";

const defaultDashboardStats: AdminDashboardStats = {
  totalSales: 0,
  totalOrders: 0,
  totalCategories: 0,
  totalWaiters: 0,
  salesOverTime: { labels: [], data: [] },
  topCategories: { labels: [], data: [] },
  latestOrders: [],
};

export async function fetchAdminDashboardStats(filter?: FinanceFilter): Promise<AdminDashboardStats> {
  try {
    const params = filter ? { start: filter.start, end: filter.end } : {};
    // This call will now correctly use the generic apiGet
    const data = await apiGet<AdminDashboardStats>(API_ROUTES.ADMIN.DASHBOARD.STATS, params);

    // IMPORTANT: This still assumes API_ROUTES.ADMIN.DASHBOARD.STATS 
    // returns data matching AdminDashboardStats directly.
    // If it returns the paginated finance summary like your example, 'data' here will be
    // { content: [...], pageable: ... } which is NOT AdminDashboardStats.
    if (
      data &&
      typeof data.totalSales !== 'undefined' && // Basic check for AdminDashboardStats structure
      data.salesOverTime &&
      data.topCategories &&
      data.latestOrders
    ) {
      return data;
    } else {
      console.warn(
        `API endpoint (${API_ROUTES.ADMIN.DASHBOARD.STATS}) did not return the expected AdminDashboardStats structure after an attempt to cast. Received:`, 
        data, // Log what 'data' actually is
        "Returning default dashboard data."
      );
      return defaultDashboardStats;
    }
  } catch (error) {
    console.error("Error fetching dashboard stats in API function:", error);
    return defaultDashboardStats;
  }
}