// src/features/admin/waiters/hooks/useAdminWaiters.ts

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  fetchWaitersForAdmin,
  addWaiterByAdmin,
  editWaiterByAdmin,
  deleteWaiterByAdmin,
} from "../api"; // Adjusted import path
import type { Waiter, AddWaiterRequest, EditWaiterRequest } from "../types"; // Adjusted import path
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useAdminWaiters() {
  const queryClient = useQueryClient();

  // Fetching waiters with React Query
  const { data: waiters = [], isLoading: loadingWaiters, error: fetchError } = useQuery<Waiter[], Error>({
    queryKey: ["admin", "waiters"],
    queryFn: fetchWaitersForAdmin,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (fetchError) {
      toast.error(`Failed to fetch waiters: ${fetchError.message}`);
    }
  }, [fetchError]);

  // Mutation for adding a waiter
  const { mutateAsync: addWaiter, isPending: isAddingWaiter } = useMutation<void, Error, AddWaiterRequest>({
    mutationFn: addWaiterByAdmin,
    onSuccess: () => {
      toast.success("Waiter added successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "waiters"] });
    },
    onError: (error) => {
      toast.error(`Failed to add waiter: ${error.message}`);
    },
  });

  // Mutation for editing a waiter
  const { mutateAsync: editWaiter, isPending: isEditingWaiter } = useMutation<void, Error, { id: number; data: EditWaiterRequest }>({
    mutationFn: ({ id, data }) => editWaiterByAdmin(id, data),
    onSuccess: (_, variables) => {
      toast.success("Waiter updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "waiters"] });
      // Optionally, optimistically update the cache if desired
      // queryClient.setQueryData(['admin', 'waiters'], (oldData: Waiter[] | undefined) =>
      //   oldData ? oldData.map(w => w.id === variables.id ? { ...w, ...variables.data } : w) : []
      // );
    },
    onError: (error) => {
      toast.error(`Failed to update waiter: ${error.message}`);
    },
  });

  // Mutation for deleting a waiter
  const { mutateAsync: deleteWaiter, isPending: isDeletingWaiter } = useMutation<void, Error, number>({
    mutationFn: deleteWaiterByAdmin,
    onSuccess: (_, id) => {
      toast.success("Waiter deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "waiters"] });
      // Optionally, optimistically update the cache
      // queryClient.setQueryData(['admin', 'waiters'], (oldData: Waiter[] | undefined) =>
      //   oldData ? oldData.filter(w => w.id !== id) : []
      // );
    },
    onError: (error) => {
      toast.error(`Failed to delete waiter: ${error.message}`);
    },
  });

  return {
    waiters,
    loadingWaiters,
    addWaiter,
    isAddingWaiter,
    editWaiter,
    isEditingWaiter,
    deleteWaiter,
    isDeletingWaiter,
    // Note: The original hook had optimistic updates directly setting local state.
    // With React Query, it's better to invalidate queries or use optimistic updates via queryClient.
    // The optimistic local state updates have been removed in favor of query invalidation.
  };
}