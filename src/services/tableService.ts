import { apiClient } from "@/lib/axios";
import { AddTableRequest, EditTableRequest, Table } from "@/types/table";

export const fetchTables = async (): Promise<Table[]> => {
  const response = await apiClient.get("/admin/viewTables");
  return response.data;
};

export const addTable = async (table: AddTableRequest) => {
  return await apiClient.post("/admin/addTable", table);
};

export const editTable = async (id: number, table: EditTableRequest) => {
  return await apiClient.put(`/admin/editTable/${id}`, table);
};

export const deleteTable = async (id: number) => {
  return await apiClient.delete(`/admin/deleteTable/${id}`);
};
