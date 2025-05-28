// src/features/admin/finances/api.ts

import { apiClient } from "@/lib/axios";
import API_ROUTES from "@/constants/apiRoutes";
import type {
  FinanceSummary,
  FoodSale,
  FinanceSummaryApiResponse, // Use the new paginated type
  FoodSalesNestedApiResponse, // Use the new paginated type for the outer "Sales" object
} from "./types";

// Fetch finance summary report
export const fetchFinanceSummaryReport = async (start: string, end: string): Promise<FinanceSummary[]> => {
  // Expect the API to return the paginated structure
  const response = await apiClient.get<FinanceSummaryApiResponse>(API_ROUTES.ADMIN.FINANCE.SUMMARY, {
    params: { start, end },
  });
  // Return only the content array, or an empty array if content is missing
  return response.data.content || [];
};

// Fetch food sales report
export const fetchFoodSalesReport = async (start: string, end: string): Promise<FoodSale[]> => {
  // Expect the API to return the nested paginated structure
  const response = await apiClient.get<FoodSalesNestedApiResponse>(API_ROUTES.ADMIN.FINANCE.FOOD_SALES, {
    params: { start, end },
  });
  // Return only the content array from the nested structure, or an empty array
  return response.data.Sales?.content || [];
};