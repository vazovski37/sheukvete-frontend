// src/features/waiter/types.ts

// From src/types/table.ts & src/types/waiter.ts (interface Table)
export interface WaiterTableInfo {
  id: number;
  tableNumber: number;
  // Add other properties if your API provides them for table listings, e.g., status
}

// From src/types/waiter/food.ts (interface FoodItem)
// and src/types/food.ts (interface FoodItem - they are similar but waiter/food.ts is more specific)
export interface WaiterDisplayFoodItem {
  id: number;
  name: string;
  price: number;
  comment1?: string;
  comment2?: string;
  comment3?: string;
  comment4?: string;
  // For UI linking or logic, if foods are fetched with category info:
  categoryId?: number;
  categoryName?: string;
  categoryType?: "MEAL" | "DRINK";
}

// From src/types/waiter/food.ts (interface FoodCategory)
export interface WaiterDisplayFoodCategory {
  id: number;
  name: string;
  type: "MEAL" | "DRINK";
}

// From src/types/waiter/food.ts (interface CategoryWithFoods)
export interface WaiterDisplayCategoryWithFoods {
  category: WaiterDisplayFoodCategory;
  food: WaiterDisplayFoodItem[];
}

// From src/types/waiter/food.ts (interface WaiterFoodResponse)
export interface WaiterAvailableFoods {
  meals: WaiterDisplayCategoryWithFoods[];
  drinks: WaiterDisplayCategoryWithFoods[];
}

// From src/types/waiter.ts (interface OrderItem)
// This is for creating/updating an order
export interface WaiterOrderInputItem {
  foodId: number;
  quantity: number;
  comment?: string; // Made optional to align with some UI logic
}

// Based on src/types/order.ts (interfaces OrderItem and WaiterOrderItem)
// This is for displaying items within an existing order
export interface WaiterDisplayOrderItem {
  id: number; // This is the backend ID of the order item (from WaiterOrderItem)
  food: { // Simplified food details for display within an order
    id: number;
    name: string;
    price: number;
    category: {
      id: number;
      name: string;
      type: "MEAL" | "DRINK";
    };
  };
  quantity: number;
  comment?: string; // Optional
  paidForWaiter?: boolean; // From WaiterOrderItem
  printedInKitchen?: boolean; // From WaiterOrderItem
}

// Based on src/types/order.ts (interfaces Order and WaiterOrder)
// This is for displaying a full order's details
export interface WaiterDisplayOrder {
  id: number; // The main Order ID (use order.id or order.orderId consistently)
  table: WaiterTableInfo;
  waiter: {
    id: number;
    username: string;
  };
  orderTime: string; // ISO string
  items: WaiterDisplayOrderItem[];
  totalAmount?: string; // From OrderResponse.totalamount (string)
  totalPrice?: number; // From WaiterOrder.totalPrice (number) - ensure one is canonical
  "additionall procentage"?: string; // From Order
  paid?: boolean; // From WaiterOrder
  visibleToKitchen?: boolean; // From WaiterOrder
  cooking?: boolean; // From WaiterOrder
}

// Based on src/types/order.ts (interface OrderResponse)
// For the API response when fetching a single order by table ID
export interface SingleOrderApiResponse {
  message?: string;
  order: WaiterDisplayOrder; // This should match the structure returned by the API
  totalamount?: string; // This was top-level in original OrderResponse
}

// From src/types/waiter.ts (interface MoveOrderRequest)
export interface MoveOrderData {
  sourceTableId: number;
  targetTableId: number;
}

// From src/types/waiter.ts (interface PartialPaymentRequest - singular item)
export interface PartialPaymentInputItem {
  foodId: number;
  comment?: string; // Match OrderItem in waiter.ts if this is used for identification
  quantityToPay: number;
}

// For the API that takes an array of these (as implied by waiterService.ts)
export type PartialPaymentPayload = PartialPaymentInputItem[];


// Based on src/types/order.ts (interface WaiterOrder)
// For displaying orders in history
export interface WaiterOrderHistoryEntry extends WaiterDisplayOrder {}

// For the API response of order history
export interface WaiterOrderHistoryApiResponse {
  orders: WaiterOrderHistoryEntry[]; // Assuming the API returns an object with an 'orders' array
}