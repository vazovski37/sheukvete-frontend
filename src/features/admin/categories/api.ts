// src/features/admin/categories/api.ts

import { apiGet, apiPost, apiPut, apiDelete } from "@/utils/axiosInstance";
import API_ROUTES from "@/constants/apiRoutes";
import type { Category, AddCategoryRequest, EditCategoryRequest, CategoryResponse } from "./types";

// Fetch all categories for admin view
export const fetchCategoriesForAdmin = async (): Promise<Category[]> => {
  try {
    const response = await apiGet<Category[]>(API_ROUTES.ADMIN.CATEGORIES.GET_ALL);
    return response; // apiGet already returns response.data
  } catch (error) {
    console.error("Error fetching categories in API function:", error);
    throw new Error("Failed to fetch categories");
  }
};

// Add a new category (by admin)
export const addCategoryByAdmin = async (categoryData: AddCategoryRequest): Promise<CategoryResponse> => {
  const response = await apiPost(API_ROUTES.ADMIN.CATEGORIES.ADD, categoryData);
  return response; // apiPost already returns response.data
};

// Edit a category's details (by admin)
export const editCategoryByAdmin = async (id: number, categoryData: EditCategoryRequest): Promise<CategoryResponse> => {
  const response = await apiPut(API_ROUTES.ADMIN.CATEGORIES.EDIT_BY_ID(id), categoryData);
  return response; // apiPut already returns response.data
};

// Delete a category (by admin)
export const deleteCategoryByAdmin = async (id: number): Promise<void> => {
  await apiDelete(API_ROUTES.ADMIN.CATEGORIES.DELETE_BY_ID(id));
};