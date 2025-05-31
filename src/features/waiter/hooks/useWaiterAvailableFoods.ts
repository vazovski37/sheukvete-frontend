// src/features/waiter/hooks/useWaiterAvailableFoods.ts
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchAvailableFoodsForOrdering } from "../api";
import type { WaiterAvailableFoods } from "../types";

const WAITER_FOODS_QUERY_KEY = ["waiter", "availableFoods"];

const defaultAvailableFoods: WaiterAvailableFoods = {
  meals: [],
  drinks: [],
};

export function useWaiterAvailableFoods() {
  const {
    data,
    isLoading: isLoadingFoods,
    error,
    isError,
  } = useQuery<WaiterAvailableFoods, Error>({
    queryKey: WAITER_FOODS_QUERY_KEY,
    queryFn: fetchAvailableFoodsForOrdering,
    staleTime: 10 * 60 * 1000, // 10 minutes, as food list might not change too often
  });

  if (isError && error) {
    toast.error(`Failed to load available foods: ${error.message}`);
  }

  return {
    availableFoods: data || defaultAvailableFoods, // Ensure it always returns the expected structure
    isLoadingFoods,
    isErrorFoods: isError,
  };
}