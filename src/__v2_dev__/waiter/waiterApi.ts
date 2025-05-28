// src/features/waiter/waiterApi.ts

import API_ROUTES from "@/constants/apiRoutes";
import { apiGet, apiPost, apiDelete, apiPut } from "@/utils/axiosInstance";

// Move an order from one table to another
export const moveOrder = (sourceTableId: number, targetTableId: number) => {
  return apiPut(API_ROUTES.WAITER.MOVE_ORDER(sourceTableId, targetTableId));
};

// Get current active order for a table
export const getOrderByTableId = (tableId: number) => {
  return apiGet(API_ROUTES.WAITER.GET_ORDER(tableId));
};

// Create or update a table's active order
export const createOrUpdateOrder = (
  tableId: number,
  items: { foodId: number; quantity: number; comment: string }[]
) => {
  return apiPost(API_ROUTES.WAITER.CREATE_OR_UPDATE_ORDER(tableId), items);
};

// Delete entire order and return total price paid
export const deleteOrder = (tableId: number) => {
  return apiDelete(API_ROUTES.WAITER.DELETE_ORDER(tableId));
};

// Delete partial items from an order (partial payment)
export const deletePartialOrderItems = (
  tableId: number,
  items: { foodId: number; comment: string; quantityToPay: number }[]
) => {
    return apiDelete(API_ROUTES.WAITER.DELETE_PARTIAL_ITEMS(tableId), {
        data: items,
      });
      
};



// Print full receipt for a table
export const printOrderReceipt = (tableId: number) => {
  return apiGet(API_ROUTES.WAITER.PRINT_ORDER(tableId));
};

// Get all available meals sorted by category
export const getAllMeals = () => {
  return apiGet(API_ROUTES.WAITER.GET_ALL_ORDERS);
};

// Get full order history
export const getOrderHistory = () => {
  return apiGet(API_ROUTES.WAITER.GET_ORDER_HISTORY);
};

// Get all tables
export const getAllTables = () => {
  return apiGet(API_ROUTES.WAITER.VIEW_TABLES);
};

// Get occupied tables
export const getOccupiedTables = () => {
  return apiGet(API_ROUTES.WAITER.VIEW_OCCUPIED_TABLES);
};

// Get preset comments for a food item
export const getFoodComments = (foodId: number) => {
  return apiGet(API_ROUTES.WAITER.GET_FOOD_COMMENTS(foodId));
};
