// src/features/waiter/hooks/useAllTables.ts

import { useQuery } from "@tanstack/react-query";
import { getAllTables } from "../waiterApi";

export const useAllTables = () => {
  return useQuery({
    queryKey: ["tables", "all"],
    queryFn: getAllTables,
  });
};
