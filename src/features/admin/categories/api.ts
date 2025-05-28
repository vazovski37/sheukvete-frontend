// src/features/admin/categories/api.ts

import { apiClient } from "@/lib/axios"; // Assuming standardized apiClient
import API_ROUTES from "@/constants/apiRoutes";
import type { Category, AddCategoryRequest, EditCategoryRequest, CategoryResponse } from "./types";

// Fetch all categories for admin view
export const fetchCategoriesForAdmin = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get<Category[]>(API_ROUTES.ADMIN.CATEGORIES.GET_ALL);
    // console.log("API Response in fetchCategoriesForAdmin:", response.data); // Keep for debugging if needed
    return response.data;
  } catch (error) {
    console.error("Error fetching categories in API function:", error);
    throw new Error("Failed to fetch categories"); // Re-throw to be caught by React Query
  }
};

// Add a new category (by admin)
export const addCategoryByAdmin = async (categoryData: AddCategoryRequest): Promise<CategoryResponse> => { // Assuming API returns the created category
  const response = await apiClient.post<CategoryResponse>(API_ROUTES.ADMIN.CATEGORIES.ADD, categoryData);
  return response.data;
};

// Edit a category's details (by admin)
export const editCategoryByAdmin = async (id: number, categoryData: EditCategoryRequest): Promise<CategoryResponse> => { // Assuming API returns updated
  const response = await apiClient.put<CategoryResponse>(API_ROUTES.ADMIN.CATEGORIES.EDIT_BY_ID(id), categoryData);
  return response.data;
};

// Delete a category (by admin)
export const deleteCategoryByAdmin = async (id: number): Promise<void> => { // Assuming delete returns no content
  await apiClient.delete(API_ROUTES.ADMIN.CATEGORIES.DELETE_BY_ID(id));
};