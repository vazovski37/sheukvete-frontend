// src/features/admin/finances/api.ts

import { apiGet } from "@/utils/axiosInstance";
import API_ROUTES from "@/constants/apiRoutes";
import type {
  FinanceSummary,
  FoodSale,
  FinanceSummaryApiResponse,
  FoodSalesNestedApiResponse,
} from "./types";

// Fetch finance summary report
export const fetchFinanceSummaryReport = async (start: string, end: string): Promise<FinanceSummary[]> => {
  const response = await apiGet<FinanceSummaryApiResponse>(API_ROUTES.ADMIN.FINANCE.SUMMARY, {
    params: { start, end },
  });
  // apiGet returns response.data, so we access content directly from it
  return response.content || [];
};

// Fetch food sales report
export const fetchFoodSalesReport = async (start: string, end: string): Promise<FoodSale[]> => {
  const response = await apiGet<FoodSalesNestedApiResponse>(API_ROUTES.ADMIN.FINANCE.FOOD_SALES, {
    params: { start, end },
  });
  // apiGet returns response.data, so we access Sales.content directly from it
  return response.Sales?.content || [];
};