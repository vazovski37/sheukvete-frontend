// src/features/waiter/hooks/useWaiterOrderHistory.ts
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchWaiterOrderHistory } from "../api";
import type { WaiterOrderHistoryEntry } from "../types";

const WAITER_ORDER_HISTORY_QUERY_KEY = ["waiter", "orderHistory"];

export function useWaiterOrderHistory() {
  const {
    data,
    isLoading: isLoadingHistory,
    error,
    isError,
  } = useQuery<WaiterOrderHistoryEntry[], Error>({
    queryKey: WAITER_ORDER_HISTORY_QUERY_KEY,
    queryFn: fetchWaiterOrderHistory,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isError && error) {
    toast.error(`Failed to load order history: ${error.message}`);
  }

  return {
    orderHistory: data || [], // Ensure it always returns an array
    isLoadingHistory,
    isErrorHistory: isError,
  };
}