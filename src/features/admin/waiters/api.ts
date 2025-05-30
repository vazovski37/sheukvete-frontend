// src/features/admin/waiters/api.ts

import API_ROUTES from "@/constants/apiRoutes";
import type { AddWaiterRequest, EditWaiterRequest, Waiter } from "./types";
import { apiGet, apiPost, apiPut, apiDelete } from "@/utils/axiosInstance";

// Fetch all waiters for admin view
export const fetchWaitersForAdmin = async (): Promise<Waiter[]> => {
  const response = await apiGet<Waiter[]>(API_ROUTES.ADMIN.WAITERS.GET_ALL);
  return response; // apiGet already returns response.data
};

// Add a new waiter (by admin)
export const addWaiterByAdmin = async (waiterData: AddWaiterRequest): Promise<void> => {
  await apiPost(API_ROUTES.ADMIN.WAITERS.ADD, waiterData);
};

// Edit a waiter's details (by admin)
export const editWaiterByAdmin = async (id: number, waiterData: EditWaiterRequest): Promise<void> => {
  await apiPut(API_ROUTES.ADMIN.WAITERS.EDIT_BY_ID(id), waiterData);
};

// Delete a waiter (by admin)
export const deleteWaiterByAdmin = async (id: number): Promise<void> => {
  await apiDelete(API_ROUTES.ADMIN.WAITERS.DELETE_BY_ID(id));
};