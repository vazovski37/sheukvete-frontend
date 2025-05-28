// src/features/waiter/hooks/useMoveOrder.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moveOrder } from "../waiterApi";

export const useMoveOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sourceTableId,
      targetTableId,
    }: {
      sourceTableId: number;
      targetTableId: number;
    }) => moveOrder(sourceTableId, targetTableId),
    onSuccess: () => {
      queryClient.invalidateQueries(["tables", "occupied"]);
    },
  });
};
