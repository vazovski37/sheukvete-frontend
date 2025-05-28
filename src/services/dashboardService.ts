import { apiClient } from "@/lib/axios";
import { apiGet } from "@/utils/axiosInstance";

export async function fetchDashboardStats() {
  try {
    const { data } = await apiGet("/admin/finances");
    return data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalSales: 0,
      totalOrders: 0,
      totalCategories: 0,
      totalWaiters: 0,
      salesOverTime: { labels: [], data: [] },
      topCategories: { labels: [], data: [] },
      latestOrders: [],
    };
  }
}
