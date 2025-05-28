// src/features/admin/finances/hooks/useAdminFinances.ts

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchFinanceSummaryReport, fetchFoodSalesReport } from "../api";
import type { FinanceSummary, FoodSale, FinanceFilter } from "../types";
import { useQuery } from "@tanstack/react-query";

// Helper to get today's date and a month ago in YYYY-MM-DD format
const getInitialDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30); // Default to last 30 days

  const formatDate = (date: Date) => date.toISOString().split("T")[0];
  return {
    start: formatDate(startDate),
    end: formatDate(endDate),
  };
};

export function useAdminFinances() {
  const [filter, setFilter] = useState<FinanceFilter>(getInitialDateRange());

  const {
    data: financeSummaryData, // Renamed to avoid conflict with potential import
    isLoading: loadingSummary,
    error: summaryError,
  } = useQuery<FinanceSummary[], Error>({
    queryKey: ["admin", "finances", "summary", filter],
    queryFn: () => fetchFinanceSummaryReport(filter.start, filter.end),
    enabled: !!filter.start && !!filter.end,
  });

  const {
    data: foodSalesData, // Renamed to avoid conflict
    isLoading: loadingFoodSales,
    error: foodSalesError,
  } = useQuery<FoodSale[], Error>({
    queryKey: ["admin", "finances", "foodSales", filter],
    queryFn: () => fetchFoodSalesReport(filter.start, filter.end),
    enabled: !!filter.start && !!filter.end,
  });

  useEffect(() => {
    if (summaryError) {
      toast.error(`Failed to fetch finance summary: ${summaryError.message}`);
    }
    if (foodSalesError) {
      toast.error(`Failed to fetch food sales: ${foodSalesError.message}`);
    }
  }, [summaryError, foodSalesError]);

  const handleSetFilter = (newFilter: FinanceFilter) => {
    setFilter(newFilter);
    // Queries will refetch automatically due to queryKey change
  };
  
  const isLoading = loadingSummary || loadingFoodSales;

  // Provide default empty arrays if data is undefined
  const financeSummary = financeSummaryData || [];
  const foodSales = foodSalesData || [];

  return {
    financeSummary,
    foodSales,
    loading: isLoading,
    filter,
    setFilter: handleSetFilter,
  };
}