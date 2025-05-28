export interface KitchenOrderItem {
  orderItemId: number;
  foodName: string;
  quantity: number;
  comment: string;
}

export interface KitchenOrder {
  tableId: number;
  tableNumber: number;
  waiterName: string;
  orderTime: string; // ISO string format, can be converted to Date if needed
  items: KitchenOrderItem[];
  cooking: boolean;
}
