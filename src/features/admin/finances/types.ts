// src/features/admin/finances/types.ts

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
  totalOrders: number;
  waiterName: string;
}

export interface FinanceFilter {
  start: string; // Date string, e.g., "YYYY-MM-DD"
  end: string;   // Date string, e.g., "YYYY-MM-DD"
}

// Type for the paginated response structure from the backend
interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

// Paginated response for FinanceSummary
export interface FinanceSummaryApiResponse {
  content: FinanceSummary[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

// Paginated response structure for FoodSale items (nested under "Sales")
export interface FoodSalesContentApiResponse {
  content: FoodSale[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

export interface FoodSalesNestedApiResponse {
  Sales: FoodSalesContentApiResponse;
}