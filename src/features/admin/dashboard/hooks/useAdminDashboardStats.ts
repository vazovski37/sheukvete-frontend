// src/features/admin/dashboard/hooks/useAdminDashboardStats.ts
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchAdminDashboardStats } from "../api";
import type { AdminDashboardStats } from "../types";
import type { FinanceFilter } from "@/features/admin/finances/types";
import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";

const getInitialDateRange = (): FinanceFilter => {
  const endDate = new Date();
  const startDate = subDays(endDate, 30);
  return {
    start: format(startDate, "yyyy-MM-dd"),
    end: format(endDate, "yyyy-MM-dd"),
  };
};

const defaultDashboardStats: AdminDashboardStats = {
  totalSales: 0, totalOrders: 0, totalCategories: 0, totalWaiters: 0,
  salesOverTime: { labels: [], data: [] },
  topCategories: { labels: [], data: [] },
  latestOrders: [],
};

export function useAdminDashboardStats() {
  const [filter, setFilter] = useState<FinanceFilter>(getInitialDateRange());

  const {
    data, 
    isLoading: loadingStats,
    error: fetchError,
    isError,
  } = useQuery<AdminDashboardStats, Error>({
    queryKey: ["admin", "dashboardStats", filter],
    queryFn: () => fetchAdminDashboardStats(filter),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (fetchError) {
      toast.error(`Failed to fetch dashboard stats: ${fetchError.message}`);
    }
  }, [fetchError]);

  // Ensure 'stats' always adheres to the AdminDashboardStats structure
  const stats: AdminDashboardStats = data || defaultDashboardStats;

  const handleSetFilter = (newFilter: FinanceFilter) => {
    setFilter(newFilter);
  };

  return {
    stats,
    loadingStats,
    isError,
    filter,
    setFilter: handleSetFilter,
  };
}