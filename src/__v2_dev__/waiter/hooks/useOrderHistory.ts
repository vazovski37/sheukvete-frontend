// src/features/waiter/hooks/useOrderHistory.ts

import { useQuery } from "@tanstack/react-query";
import { getOrderHistory } from "../waiterApi";

export const useOrderHistory = () => {
  return useQuery({
    queryKey: ["orders", "history"],
    queryFn: getOrderHistory,
  });
};
