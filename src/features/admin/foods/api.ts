// src/features/admin/foods/api.ts

import { apiClient } from "@/lib/axios"; // Assuming standardized apiClient
import API_ROUTES from "@/constants/apiRoutes";
import type { AddFoodRequest, EditFoodRequest, FoodResponse, AdminFoodData } from "./types";

// Fetch all foods for admin view (grouped by category as per original service)
export const fetchFoodsForAdmin = async (): Promise<AdminFoodData[]> => {
  const response = await apiClient.get<AdminFoodData[]>(API_ROUTES.ADMIN.FOODS.GET_ALL);
  return response.data;
};

// Add a new food item (by admin)
export const addFoodByAdmin = async (foodData: AddFoodRequest): Promise<FoodResponse> => {
  const response = await apiClient.post<FoodResponse>(API_ROUTES.ADMIN.FOODS.ADD, foodData);
  return response.data;
};

// Edit a food item's details (by admin)
export const editFoodByAdmin = async (id: number, foodData: EditFoodRequest): Promise<FoodResponse> => {
  const response = await apiClient.put<FoodResponse>(API_ROUTES.ADMIN.FOODS.EDIT_BY_ID(id), foodData);
  return response.data;
};

// Delete a food item (by admin)
export const deleteFoodByAdmin = async (id: number): Promise<void> => { // Assuming delete returns no content
  await apiClient.delete(API_ROUTES.ADMIN.FOODS.DELETE_BY_ID(id));
  // Original service returned response.data, if backend sends confirmation, adjust return type.
};