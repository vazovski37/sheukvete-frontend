// src/features/admin/tables/api.ts

import { apiClient } from "@/lib/axios"; // Assuming standardized apiClient
import API_ROUTES from "@/constants/apiRoutes";
import type { AddTableRequest, EditTableRequest, Table } from "./types";

// Fetch all tables for admin view
export const fetchTablesForAdmin = async (): Promise<Table[]> => {
  const response = await apiClient.get<Table[]>(API_ROUTES.ADMIN.TABLES.GET_ALL);
  return response.data;
};

// Add a new table (by admin)
export const addTableByAdmin = async (tableData: AddTableRequest): Promise<Table> => { // Assuming API returns the created table
  const response = await apiClient.post<Table>(API_ROUTES.ADMIN.TABLES.ADD, tableData);
  return response.data;
};

// Edit a table's details (by admin)
export const editTableByAdmin = async (id: number, tableData: EditTableRequest): Promise<Table> => { // Assuming API returns the updated table
  const response = await apiClient.put<Table>(API_ROUTES.ADMIN.TABLES.EDIT_BY_ID(id), tableData);
  return response.data;
};

// Delete a table (by admin)
export const deleteTableByAdmin = async (id: number): Promise<void> => {
  await apiClient.delete(API_ROUTES.ADMIN.TABLES.DELETE_BY_ID(id));
};