// src/features/admin/foods/hooks/useAdminFoods.ts

import { useEffect } from "react";
import { toast } from "sonner";
import {
  fetchFoodsForAdmin,
  addFoodByAdmin,
  editFoodByAdmin, // Ensured this is imported
  deleteFoodByAdmin,
} from "../api"; // Importing from the co-located api.ts
import type { AdminFoodData, AddFoodRequest, EditFoodRequest, FoodResponse } from "../types"; // Importing from co-located types.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useAdminFoods() {
  const queryClient = useQueryClient();

  // Fetching foods with React Query
  const { data: foodsData = [], isLoading: loadingFoods, error: fetchError } = useQuery<AdminFoodData[], Error>({
    queryKey: ["admin", "foods"],
    queryFn: fetchFoodsForAdmin,
    staleTime: 5 * 60 * 1000, // 5 minutes, adjust as needed
  });

  // Effect to show toast on fetch error
  useEffect(() => {
    if (fetchError) {
      toast.error(`Failed to fetch foods: ${fetchError.message}`);
    }
  }, [fetchError]);

  // Mutation for adding a food item
  const { mutateAsync: addFood, isPending: isAddingFood } = useMutation<FoodResponse, Error, AddFoodRequest>({
    mutationFn: addFoodByAdmin, // Calls the function from api.ts
    onSuccess: () => {
      toast.success("Food item added successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "foods"] });
      // Optionally invalidate categories if your food list affects category displays (e.g., item counts)
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"]});
    },
    onError: (error) => {
      toast.error(`Failed to add food item: ${error.message}`);
    },
  });

  // Mutation for editing a food item
  const { mutateAsync: editFood, isPending: isEditingFood } = useMutation<FoodResponse, Error, { id: number; data: EditFoodRequest }>({
    mutationFn: ({ id, data }) => editFoodByAdmin(id, data), // CORRECTLY calls the function from api.ts
    onSuccess: () => {
      toast.success("Food item updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "foods"] });
    },
    onError: (error) => {
      toast.error(`Failed to update food item: ${error.message}`);
    },
  });

  // Mutation for deleting a food item
  const { mutateAsync: deleteFood, isPending: isDeletingFood } = useMutation<void, Error, number>({
    mutationFn: deleteFoodByAdmin, // Calls the function from api.ts
    onSuccess: () => {
      toast.success("Food item deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "foods"] });
    },
    onError: (error) => {
      toast.error(`Failed to delete food item: ${error.message}`);
    },
  });

  return {
    foodsData, // This is the array of AdminFoodData (categories with nested foods)
    loadingFoods,
    addFood,
    isAddingFood,
    editFood,
    isEditingFood,
    deleteFood,
    isDeletingFood,
  };
}