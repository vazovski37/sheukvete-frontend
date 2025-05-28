// src/features/waiter/hooks/useOrderByTableId.ts

import { useQuery } from "@tanstack/react-query";
import { getOrderByTableId } from "../waiterApi";

export const useOrderByTableId = (tableId: number) => {
  return useQuery({
    queryKey: ["orders", "active", tableId],
    queryFn: () => getOrderByTableId(tableId),
    enabled: !!tableId,
  });
};
