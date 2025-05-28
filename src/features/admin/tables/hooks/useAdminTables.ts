// src/features/admin/tables/hooks/useAdminTables.ts

import { useEffect } from "react";
import { toast } from "sonner";
import {
  fetchTablesForAdmin,
  addTableByAdmin,
  editTableByAdmin,
  deleteTableByAdmin,
} from "../api";
import type { Table, AddTableRequest, EditTableRequest } from "../types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useAdminTables() {
  const queryClient = useQueryClient();

  const { data: tables = [], isLoading: loadingTables, error: fetchError } = useQuery<Table[], Error>({
    queryKey: ["admin", "tables"],
    queryFn: fetchTablesForAdmin,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (fetchError) {
      toast.error(`Failed to fetch tables: ${fetchError.message}`);
    }
  }, [fetchError]);

  const { mutateAsync: addTable, isPending: isAddingTable } = useMutation<Table, Error, AddTableRequest>({
    mutationFn: addTableByAdmin,
    onSuccess: () => {
      toast.success("Table added successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "tables"] });
    },
    onError: (error) => {
      toast.error(`Failed to add table: ${error.message}`);
    },
  });

  const { mutateAsync: editTable, isPending: isEditingTable } = useMutation<Table, Error, { id: number; data: EditTableRequest }>({
    mutationFn: ({ id, data }) => editTableByAdmin(id, data),
    onSuccess: () => {
      toast.success("Table updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "tables"] });
    },
    onError: (error) => {
      toast.error(`Failed to update table: ${error.message}`);
    },
  });

  const { mutateAsync: deleteTable, isPending: isDeletingTable } = useMutation<void, Error, number>({
    mutationFn: deleteTableByAdmin,
    onSuccess: () => {
      toast.success("Table deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "tables"] });
    },
    onError: (error) => {
      toast.error(`Failed to delete table: ${error.message}`);
    },
  });

  return {
    tables,
    loadingTables,
    addTable,
    isAddingTable,
    editTable,
    isEditingTable,
    deleteTable,
    isDeletingTable,
  };
}