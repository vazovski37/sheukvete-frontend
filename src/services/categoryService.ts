import { apiClient } from "@/lib/axios";
import { Category, AddCategoryRequest, EditCategoryRequest } from "@/types/category";

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get("/admin/viewCategories");
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
};

export const addCategory = async (category: AddCategoryRequest) => {
  return apiClient.post("/admin/addCategory", category);
};

export const editCategory = async (id: number, category: EditCategoryRequest) => {
  return apiClient.put(`/admin/editCategory/${id}`, category);
};

export const deleteCategory = async (id: number) => {
  return apiClient.delete(`/admin/deleteCategory/${id}`);
};
