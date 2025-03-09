import { FoodItem, FoodItemm } from "@/types/food";

export interface Order {
    orderId: number;
    table: {
      id: number;
      tableNumber: number;
    };
    waiter: {
      id: number;
      username: string;
      role: string;
      active: boolean;
    };
    orderTime: string;
    items: OrderItem[];
    totalamount?: string; // ✅ Ensure this exists
    "additionall procentage"?: string; // ✅ Ensure this exists
  }
  

export interface OrderItem {
    food: FoodItemm;
    quantity: number;
    comment?: string;
}

export interface OrderResponse {
    totalamount: string;
    message: string;
    order: Order;
}

export interface OrderRequestItem {
    foodId: number;
    quantity: number;
    comment: string;
}

