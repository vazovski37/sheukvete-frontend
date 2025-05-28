// src/features/admin/waiters/api.ts

import { apiClient } from "@/lib/axios"; // Assuming you'll standardize to apiClient from src/lib/axios.ts
import API_ROUTES from "@/constants/apiRoutes";
import type { AddWaiterRequest, EditWaiterRequest, Waiter } from "./types";

// Fetch all waiters for admin view
export const fetchWaitersForAdmin = async (): Promise<Waiter[]> => {
  const response = await apiClient.get<Waiter[]>(API_ROUTES.ADMIN.WAITERS.GET_ALL);
  return response.data;
};

// Add a new waiter (by admin)
export const addWaiterByAdmin = async (waiterData: AddWaiterRequest): Promise<void> => {
  await apiClient.post(API_ROUTES.ADMIN.WAITERS.ADD, waiterData);
};

// Edit a waiter's details (by admin)
export const editWaiterByAdmin = async (id: number, waiterData: EditWaiterRequest): Promise<void> => {
  await apiClient.put(API_ROUTES.ADMIN.WAITERS.EDIT_BY_ID(id), waiterData);
};

// Delete a waiter (by admin)
export const deleteWaiterByAdmin = async (id: number): Promise<void> => {
  await apiClient.delete(API_ROUTES.ADMIN.WAITERS.DELETE_BY_ID(id));
};