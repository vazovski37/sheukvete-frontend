// src/features/waiter/hooks/useFoodComments.ts

import { useQuery } from "@tanstack/react-query";
import { getFoodComments } from "../waiterApi";

export const useFoodComments = (foodId: number) => {
  return useQuery({
    queryKey: ["food", "comments", foodId],
    queryFn: () => getFoodComments(foodId),
    enabled: !!foodId,
  });
};
