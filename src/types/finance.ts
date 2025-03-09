// types/finances.ts

export interface FoodSale {
  foodId: number;
  foodName: string;
  categoryName: string;
  comment: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface FinanceSummary {
  totalAmount: number;
  paymentDate: string;
  waiterName: string;
  totalOrders: number;
}

export interface FinanceFilter {
  start: string;
  end: string;
}
