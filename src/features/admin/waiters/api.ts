// src/features/admin/waiters/api.ts

import API_ROUTES from "@/constants/apiRoutes";
import type { AddWaiterRequest, EditWaiterRequest, Waiter } from "./types";
import { apiGet, apiPost, apiPut, apiDelete } from "@/utils/axiosInstance"; // Corrected import path

// Fetch all waiters for admin view
export const fetchWaitersForAdmin = async (): Promise<Waiter[]> => {
  const response = await apiGet(API_ROUTES.ADMIN.WAITERS.GET_ALL); // Changed to apiGet
  return response.data;
};

// Add a new waiter (by admin)
export const addWaiterByAdmin = async (waiterData: AddWaiterRequest): Promise<void> => {
  await apiPost(API_ROUTES.ADMIN.WAITERS.ADD, waiterData); // Changed to apiPost
};

// Edit a waiter's details (by admin)
export const editWaiterByAdmin = async (id: number, waiterData: EditWaiterRequest): Promise<void> => {
  await apiPut(API_ROUTES.ADMIN.WAITERS.EDIT_BY_ID(id), waiterData); // Changed to apiPut
};

// Delete a waiter (by admin)
export const deleteWaiterByAdmin = async (id: number): Promise<void> => {
  await apiDelete(API_ROUTES.ADMIN.WAITERS.DELETE_BY_ID(id)); // Changed to apiDelete
};