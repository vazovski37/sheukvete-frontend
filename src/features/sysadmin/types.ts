// src/features/system-admin/types.ts

export interface Restaurant {
    id: number;
    name: string;
    tenantCode: string;
  }
  
  export interface CreateRestaurantRequest {
    name: string;
    password: string;
    confirmPassword: string;
  }
  
  export interface UpdateRestaurantRequest {
    name: string;
    password: string;
    confirmPassword: string;
  }
  
  export interface PaginatedRestaurants {
    content: Restaurant[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  }
  