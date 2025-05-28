// src/features/waiter/hooks/useCreateOrUpdateOrder.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrUpdateOrder } from "../waiterApi";

export const useCreateOrUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tableId,
      items,
    }: {
      tableId: number;
      items: { foodId: number; quantity: number; comment: string }[];
    }) => createOrUpdateOrder(tableId, items),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries(["orders", "active", variables.tableId]);
      queryClient.invalidateQueries(["tables", "occupied"]);
    },
  });
};
