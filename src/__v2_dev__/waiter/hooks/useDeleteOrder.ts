// src/features/waiter/hooks/useDeleteOrder.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOrder } from "../waiterApi";

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tableId: number) => deleteOrder(tableId),
    onSuccess: (_data, tableId) => {
      queryClient.invalidateQueries(["orders", "active", tableId]);
      queryClient.invalidateQueries(["tables", "occupied"]);
    },
  });
};
