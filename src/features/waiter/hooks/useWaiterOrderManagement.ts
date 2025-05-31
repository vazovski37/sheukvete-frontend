// src/features/waiter/hooks/useWaiterOrderManagement.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchWaiterDashboardTables,
  fetchWaiterOccupiedTables,
  fetchWaiterOrderByTableId,
  createOrUpdateWaiterOrder,
  processFullOrderPayment,
  processPartialOrderPayment,
  moveWaiterOrderBetweenTables,
  // If you keep a generic delete order separate from payment:
  // deleteWaiterOrder (needs to be defined in api.ts)
} from "../api";
import type {
  WaiterTableInfo,
  WaiterDisplayOrder,
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

  // Fetch order for a specific table - this query will be managed by components needing it
  // Example of how a component would call it:
  // const { data: order, isLoading: isLoadingOrder } = useQuery({
  //   queryKey: WAITER_QUERY_KEYS.orderByTableId(selectedTableId),
  //   queryFn: () => selectedTableId ? fetchWaiterOrderByTableId(selectedTableId) : Promise.resolve(null),
  //   enabled: !!selectedTableId,
  // });
  // For simplicity in this hook, we can provide a function to load it on demand
  // and then components can manage their own query state for a specific order.

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
      // Occupied tables might still be occupied
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

  // The original useOrdersManagement also had a handleDeleteOrder separate from payment
  // If you need this, define an API function and a mutation for it.
  // const { mutateAsync: deleteOrder, isPending: isDeletingOrder } = useMutation...

  return {
    tables,
    isLoadingTables,
    occupiedTables,
    isLoadingOccupiedTables,
    // Functions for mutations:
    updateOrder,
    isUpdatingOrder,
    payFullOrder,
    isPayingFullOrder,
    payPartialOrder,
    isPayingPartialOrder,
    moveOrder,
    isMovingOrder,
    // Function to manually trigger fetching a single order (or let component do it directly)
    // This hook will not hold 'order' state directly to avoid complexity.
    // Components can use useQuery with fetchWaiterOrderByTableId.
  };
}