export interface Waiter {
    id: number;
    username: string;
    role: string;
    active: boolean;
  }
  
  export interface AddWaiterRequest {
    username: string;
    password: string;
    confirmPassword: string;
  }
  
  export interface EditWaiterRequest {
    username: string;
  }
  
  export interface Table {
    id: number;
    tableNumber: number;
  }
  
  export interface OrderItem {
    foodId: number;
    quantity: number;
    comment?: string;
  }
  
  export interface Order {
    tableId: number;
    items: OrderItem[];
  }
  
  export interface MoveOrderRequest {
    sourceTableId: number;
    targetTableId: number;
  }
  
  export interface PartialPaymentRequest {
    foodId: number;
    comment?: string;
    quantityToPay: number;
  }
  
  
  