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


export interface WaiterOrder {
  id: number;
  paid: boolean;
  visibleToKitchen: boolean;
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
  cooking: boolean;
  totalPrice: number;
  items: WaiterOrderItem[];
}

export interface WaiterOrderItem {
  id: number;
  paidForWaiter: boolean;
  printedInKitchen: boolean;
  quantity: number;
  comment: string;
  food: {
    id: number;
    name: string;
    price: number;
    comments: any[]; // or a more specific type if available
    category: {
      id: number;
      name: string;
      type: "MEAL" | "DRINK";
    };
  };
}
