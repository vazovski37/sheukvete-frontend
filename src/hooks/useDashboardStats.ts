import { useEffect, useState } from "react";
import { fetchDashboardStats } from "@/services/dashboardService";

// Define the expected data structure
interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCategories: number;
  totalWaiters: number;
  salesOverTime: { labels: string[]; data: number[] };
  topCategories: { labels: string[]; data: number[] };
  latestOrders: { id: number; customer: string; total: number; status: string }[];
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return { stats, loading };
}
