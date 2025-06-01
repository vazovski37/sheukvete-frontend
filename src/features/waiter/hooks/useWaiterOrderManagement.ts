// src/features/waiter/hooks/useWaiterOrderManagement.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchWaiterDashboardTables,
  fetchWaiterOccupiedTables,
  // fetchWaiterOrderByTableId, // Not directly used by a hook-managed query here
  createOrUpdateWaiterOrder,
  processFullOrderPayment,
  processPartialOrderPayment,
  moveWaiterOrderBetweenTables,
  // If you keep a generic delete order separate from payment:
  // deleteWaiterOrder (needs to be defined in api.ts)
} from "../api";
import type {
  WaiterTableInfo,
  // WaiterDisplayOrder, // Not directly used by a hook-managed query here
  WaiterOrderInputItem,
  MoveOrderData,
  PartialPaymentPayload
} from "../types";

const WAITER_QUERY_KEYS = {
  tables: ["waiter", "tables"],
  occupiedTables: ["waiter", "occupiedTables"],
  orderByTableId: (tableId: number | null) => ["waiter", "order", tableId],
};

export function useWaiterOrderManagement() {
  const queryClient = useQueryClient();

  // Fetch all tables
  const { data: tables = [], isLoading: isLoadingTables } = useQuery<WaiterTableInfo[], Error>({
    queryKey: WAITER_QUERY_KEYS.tables,
    queryFn: fetchWaiterDashboardTables,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch occupied tables
  const { data: occupiedTables = [], isLoading: isLoadingOccupiedTables } = useQuery<WaiterTableInfo[], Error>({
    queryKey: WAITER_QUERY_KEYS.occupiedTables,
    queryFn: fetchWaiterOccupiedTables,
    staleTime: 1 * 60 * 1000, // 1 minute, might change more frequently
  });

  // Mutation for creating/updating an order
  const { mutateAsync: updateOrder, isPending: isUpdatingOrder } = useMutation<void, Error, { tableId: number; items: WaiterOrderInputItem[] }>({
    mutationFn: ({ tableId, items }) => createOrUpdateWaiterOrder(tableId, items),
    onSuccess: (_, variables) => {
      toast.success("Order updated successfully!");
      queryClient.invalidateQueries({ queryKey: WAITER_QUERY_KEYS.orderByTableId(variables.tableId) });
      queryClient.invalidateQueries({ queryKey: WAITER_QUERY_KEYS.occupiedTables }); // Table might become occupied
    },
    onError: (error) => {
      toast.error(`Failed to update order: ${error.message}`);
    },
  });

  // Mutation for full order payment
  const { mutateAsync: payFullOrder, isPending: isPayingFullOrder } = useMutation<void, Error, number>({
    mutationFn: (tableId) => processFullOrderPayment(tableId),
    onSuccess: (_, tableId) => {
      toast.success("Order paid successfully!");
      queryClient.setQueryData(WAITER_QUERY_KEYS.orderByTableId(tableId), null); // Optimistically set order to null
      queryClient.invalidateQueries({ queryKey: WAITER_QUERY_KEYS.orderByTableId(tableId) }); // Or refetch
      queryClient.invalidateQueries({ queryKey: WAITER_QUERY_KEYS.occupiedTables }); // Table might become free
    },
    onError: (error) => {
      toast.error(`Failed to process full payment: ${error.message}`);
    },
  });

  // Mutation for partial order payment
  const { mutateAsync: payPartialOrder, isPending: isPayingPartialOrder } = useMutation<void, Error, { tableId: number; items: PartialPaymentPayload }>({
    mutationFn: ({ tableId, items }) => processPartialOrderPayment(tableId, items),
    onSuccess: (_, variables) => {
      toast.success("Partial payment completed!");
      queryClient.invalidateQueries({ queryKey: WAITER_QUERY_KEYS.orderByTableId(variables.tableId) });
      // ALWAYS invalidate occupiedTables, as a partial payment MIGHT be the final one,
      // leading to the table becoming free. If it's not the final one, the backend
      // will still correctly report it as occupied.
      queryClient.invalidateQueries({ queryKey: WAITER_QUERY_KEYS.occupiedTables }); // <<< THIS LINE IS ADDED/MODIFIED
    },
    onError: (error) => {
      toast.error(`Failed to process partial payment: ${error.message}`);
    },
  });

  // Mutation for moving an order
  const { mutateAsync: moveOrder, isPending: isMovingOrder } = useMutation<void, Error, MoveOrderData>({
    mutationFn: (request) => moveWaiterOrderBetweenTables(request),
    onSuccess: (_, request) => {
      toast.success("Order moved successfully!");
      queryClient.invalidateQueries({ queryKey: WAITER_QUERY_KEYS.orderByTableId(request.sourceTableId) });
      queryClient.invalidateQueries({ queryKey: WAITER_QUERY_KEYS.orderByTableId(request.targetTableId) });
      queryClient.invalidateQueries({ queryKey: WAITER_QUERY_KEYS.occupiedTables });
    },
    onError: (error) => {
      toast.error(`Failed to move order: ${error.message}`);
    },
  });

  return {
    tables,
    isLoadingTables,
    occupiedTables,
    isLoadingOccupiedTables,
    updateOrder,
    isUpdatingOrder,
    payFullOrder,
    isPayingFullOrder,
    payPartialOrder,
    isPayingPartialOrder,
    moveOrder,
    isMovingOrder,
  };
}