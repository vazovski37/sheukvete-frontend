// src/features/admin/tables/api.ts

import { apiGet, apiPost, apiPut, apiDelete } from "@/utils/axiosInstance";
import API_ROUTES from "@/constants/apiRoutes";
import type { AddTableRequest, EditTableRequest, Table } from "./types";

// Fetch all tables for admin view
export const fetchTablesForAdmin = async (): Promise<Table[]> => {
  const response = await apiGet<Table[]>(API_ROUTES.ADMIN.TABLES.GET_ALL);
  return response; // apiGet already returns response.data
};

// Add a new table (by admin)
export const addTableByAdmin = async (tableData: AddTableRequest): Promise<Table> => {
  const response = await apiPost(API_ROUTES.ADMIN.TABLES.ADD, tableData);
  return response; // apiPost already returns response.data
};

// Edit a table's details (by admin)
export const editTableByAdmin = async (id: number, tableData: EditTableRequest): Promise<Table> => {
  const response = await apiPut(API_ROUTES.ADMIN.TABLES.EDIT_BY_ID(id), tableData);
  return response; // apiPut already returns response.data
};

// Delete a table (by admin)
export const deleteTableByAdmin = async (id: number): Promise<void> => {
  await apiDelete(API_ROUTES.ADMIN.TABLES.DELETE_BY_ID(id));
};