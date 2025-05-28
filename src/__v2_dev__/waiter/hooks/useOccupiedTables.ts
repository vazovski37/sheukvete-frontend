// src/features/waiter/hooks/useOccupiedTables.ts

import { useQuery } from "@tanstack/react-query";
import { getOccupiedTables } from "../waiterApi";

export const useOccupiedTables = () => {
  return useQuery({
    queryKey: ["tables", "occupied"],
    queryFn: getOccupiedTables,
  });
};
