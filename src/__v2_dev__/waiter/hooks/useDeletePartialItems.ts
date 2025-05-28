// src/features/waiter/hooks/useDeletePartialItems.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePartialOrderItems } from "../waiterApi";

export const useDeletePartialItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tableId,
      items,
    }: {
      tableId: number;
      items: { foodId: number; comment: string; quantityToPay: number }[];
    }) => deletePartialOrderItems(tableId, items),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries(["orders", "active", variables.tableId]);
    },
  });
};
