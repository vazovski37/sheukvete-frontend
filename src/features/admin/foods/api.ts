// src/features/admin/foods/api.ts

import { apiGet, apiPost, apiPut, apiDelete } from "@/utils/axiosInstance";
import API_ROUTES from "@/constants/apiRoutes";
import type { AddFoodRequest, EditFoodRequest, FoodResponse, AdminFoodData } from "./types";

// Fetch all foods for admin view (grouped by category as per original service)
export const fetchFoodsForAdmin = async (): Promise<AdminFoodData[]> => {
  const response = await apiGet<AdminFoodData[]>(API_ROUTES.ADMIN.FOODS.GET_ALL);
  return response; // apiGet already returns response.data
};

// Add a new food item (by admin)
export const addFoodByAdmin = async (foodData: AddFoodRequest): Promise<FoodResponse> => {
  const response = await apiPost(API_ROUTES.ADMIN.FOODS.ADD, foodData);
  return response; // apiPost already returns response.data
};

// Edit a food item's details (by admin)
export const editFoodByAdmin = async (id: number, foodData: EditFoodRequest): Promise<FoodResponse> => {
  const response = await apiPut(API_ROUTES.ADMIN.FOODS.EDIT_BY_ID(id), foodData);
  return response; // apiPut already returns response.data
};

// Delete a food item (by admin)
export const deleteFoodByAdmin = async (id: number): Promise<void> => {
  await apiDelete(API_ROUTES.ADMIN.FOODS.DELETE_BY_ID(id));
};