// src/features/admin/dashboard/types.ts

export interface SalesOverTimeData {
  labels: string[];
  data: number[];
}

export interface TopCategoriesData {
  labels: string[];
  data: number[];
}

export interface LatestOrderItem {
  id: number; // Or string
  customer: string;
  total: number;
  status: string;
}

export interface AdminDashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCategories: number;
  totalWaiters: number;
  salesOverTime: SalesOverTimeData;
  topCategories: TopCategoriesData;
  latestOrders: LatestOrderItem[];
}