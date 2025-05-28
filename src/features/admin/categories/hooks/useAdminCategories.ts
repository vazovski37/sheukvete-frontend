// src/features/admin/categories/hooks/useAdminCategories.ts

import { useEffect } from "react";
import { toast } from "sonner";
import {
  fetchCategoriesForAdmin,
  addCategoryByAdmin,
  editCategoryByAdmin,
  deleteCategoryByAdmin,
} from "../api";
import type { Category, AddCategoryRequest, EditCategoryRequest, CategoryResponse, CategoryType } from "../types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useAdminCategories() {
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading: loadingCategories, error: fetchError } = useQuery<Category[], Error>({
    queryKey: ["admin", "categories"],
    queryFn: fetchCategoriesForAdmin,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (fetchError) {
      toast.error(`Failed to fetch categories: ${fetchError.message}`);
    }
  }, [fetchError]);

  const { mutateAsync: addCategory, isPending: isAddingCategory } = useMutation<CategoryResponse, Error, { categoryName: string; categoryType: CategoryType }>({
    mutationFn: ({ categoryName, categoryType }) => addCategoryByAdmin({ categoryName, categoryType }),
    onSuccess: () => {
      toast.success("Category added successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
    onError: (error) => {
      toast.error(`Failed to add category: ${error.message}`);
    },
  });

  const { mutateAsync: updateCategory, isPending: isUpdatingCategory } = useMutation<CategoryResponse, Error, { id: number; data: EditCategoryRequest }>({
    mutationFn: ({ id, data }) => editCategoryByAdmin(id, data),
    onSuccess: () => {
      toast.success("Category updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
    onError: (error) => {
      toast.error(`Failed to update category: ${error.message}`);
    },
  });

  const { mutateAsync: deleteCategory, isPending: isDeletingCategory } = useMutation<void, Error, number>({
    mutationFn: deleteCategoryByAdmin,
    onSuccess: () => {
      toast.success("Category deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
    onError: (error) => {
      toast.error(`Failed to delete category: ${error.message}`);
    },
  });

  return {
    categories,
    loadingCategories,
    addCategory,
    isAddingCategory,
    updateCategory,
    isUpdatingCategory,
    deleteCategory,
    isDeletingCategory,
  };
}