// src/features/admin/dashboard/api.ts

import { apiGet } from "@/utils/axiosInstance";
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
    // apiGet already returns response.data, so no need for .data access here
    const data = await apiGet<AdminDashboardStats>(API_ROUTES.ADMIN.DASHBOARD.STATS, params);

    // Basic structural validation, as the API might return a generic object on error or unexpected data
    if (
      data &&
      typeof data.totalSales !== 'undefined' &&
      data.salesOverTime &&
      data.topCategories &&
      data.latestOrders
    ) {
      return data;
    } else {
      console.warn(
        `API endpoint (${API_ROUTES.ADMIN.DASHBOARD.STATS}) did not return the expected AdminDashboardStats structure. Received:`,
        data,
        "Returning default dashboard data."
      );
      return defaultDashboardStats;
    }
  } catch (error) {
    console.error("Error fetching dashboard stats in API function:", error);
    return defaultDashboardStats;
  }
}