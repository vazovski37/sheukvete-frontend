// services/financeService.ts
import { apiClient } from "@/lib/axios";
import { FinanceSummary, FoodSale } from "@/types/finance";

export const fetchFinanceSummary = async (start: string, end: string): Promise<FinanceSummary[]> => {
  const response = await apiClient.get(`/admin/finances`, {
    params: { start, end },
  });
  return response.data;
};

export const fetchFoodSales = async (start: string, end: string): Promise<FoodSale[]> => {
  const response = await apiClient.get(`/admin/finances/food-sales`, {
    params: { start, end },
  });
  return response.data.Sales;
};
