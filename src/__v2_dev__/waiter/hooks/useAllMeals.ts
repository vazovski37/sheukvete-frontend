// src/features/waiter/hooks/useAllMeals.ts

import { useQuery } from "@tanstack/react-query";
import { getAllMeals } from "../waiterApi";

export const useAllMeals = () => {
  return useQuery({
    queryKey: ["meals"],
    queryFn: getAllMeals,
  });
};
