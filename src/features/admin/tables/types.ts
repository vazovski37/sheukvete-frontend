// src/features/admin/tables/types.ts

export interface Table {
  id: number;
  tableNumber: number;
}

export interface AddTableRequest {
  tableNumber: number;
}

export interface EditTableRequest {
  tableNumber: number;
}