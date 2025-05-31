// src/features/waiter/api.ts

import { apiGet, apiPost, apiPut, apiDelete } from "@/utils/axiosInstance";
import API_ROUTES from "@/constants/apiRoutes";
import type {
  WaiterTableInfo,
  WaiterAvailableFoods,
  WaiterOrderInputItem,
  SingleOrderApiResponse,
  WaiterDisplayOrder,
  MoveOrderData,
  PartialPaymentPayload, // Use this for the array of items
  WaiterOrderHistoryApiResponse,
  WaiterOrderHistoryEntry
} from "./types";

// Fetch all tables visible to the waiter
export const fetchWaiterDashboardTables = async (): Promise<WaiterTableInfo[]> => {
  return apiGet<WaiterTableInfo[]>(API_ROUTES.WAITER.VIEW_TABLES);
};

// Fetch occupied tables (tables with active orders)
export const fetchWaiterOccupiedTables = async (): Promise<WaiterTableInfo[]> => {
  return apiGet<WaiterTableInfo[]>(API_ROUTES.WAITER.VIEW_OCCUPIED_TABLES);
};

// Fetch available foods for waiters (meals and drinks)
export const fetchAvailableFoodsForOrdering = async (): Promise<WaiterAvailableFoods> => {
  // API_ROUTES.WAITER.GET_AVAILABLE_FOODS is "/waiter/orders" in your constants file
  // This implies this endpoint returns the WaiterAvailableFoods structure.
  return apiGet<WaiterAvailableFoods>(API_ROUTES.WAITER.GET_AVAILABLE_FOODS);
};

// Fetch the current order for a specific table
export const fetchWaiterOrderByTableId = async (tableId: number): Promise<WaiterDisplayOrder | null> => {
  try {
    // Your original waiterService.ts expected OrderResponse which has `order` nested.
    // OrderResponse type from src/types/order.ts: { totalamount: string, message: string, order: Order }
    const response = await apiGet<SingleOrderApiResponse>(API_ROUTES.WAITER.GET_ORDER_BY_TABLE_ID(tableId));
    return response?.order || null; 
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null; // No order found for this table
    }
    console.error(`Error fetching order for table ${tableId}:`, error);
    throw error; 
  }
};

// Create or update an order for a table
export const createOrUpdateWaiterOrder = async (
  tableId: number,
  items: WaiterOrderInputItem[] // The body is an array of items
): Promise<void> => {
  // waiterService.ts `updateOrder` sends `items` directly as the body.
  return apiPost(API_ROUTES.WAITER.CREATE_OR_UPDATE_ORDER(tableId), items);
};

// Move an order from one table to another
export const moveWaiterOrderBetweenTables = async (request: MoveOrderData): Promise<void> => {
  // waiterService.ts uses apiClient.put directly with a constructed path.
  // API_ROUTES.WAITER.MOVE_ORDER generates this path.
  return apiPut(API_ROUTES.WAITER.MOVE_ORDER(request.sourceTableId, request.targetTableId));
};

// Pay for a full order (logically deletes/clears the order for the table)
export const processFullOrderPayment = async (tableId: number): Promise<void> => {
  // waiterService.ts uses apiClient.delete.
  return apiDelete(API_ROUTES.WAITER.DELETE_FULL_ORDER(tableId));
};

// Pay for partial order items
export const processPartialOrderPayment = async (
  tableId: number,
  itemsToPay: PartialPaymentPayload // This is an array of PartialPaymentInputItem
): Promise<void> => {
  // waiterService.ts `payPartialOrder` calls `apiDelete(ROUTE, items)`
  // Your apiDelete in axiosInstance supports a body via config: { data: itemsToPay }
  return apiDelete(API_ROUTES.WAITER.DELETE_PARTIAL_ORDER_ITEMS(tableId), { data: itemsToPay });
};

// Fetch waiter's order history
export const fetchWaiterOrderHistory = async (): Promise<WaiterOrderHistoryEntry[]> => {
  // waiterService.ts `fetchWaiterOrders` expects { orders: WaiterOrder[] }
  const response = await apiGet<WaiterOrderHistoryApiResponse>(API_ROUTES.WAITER.GET_ORDER_HISTORY);
  return response?.orders || [];
};

// Optional: If food comments are fetched separately and still needed
// export const fetchFoodPresetComments = async (foodId: number): Promise<string[]> => {
//   return apiGet<string[]>(API_ROUTES.WAITER.GET_FOOD_COMMENTS(foodId));
// };

// Optional: If printing receipt is an API call
// export const printOrderReceiptForWaiter = async (tableId: number): Promise<Blob> => { // Assuming it returns a blob
//    return apiGetBlob(API_ROUTES.WAITER.PRINT_ORDER_RECEIPT(tableId)); // Use apiGetBlob if it's a file
// };