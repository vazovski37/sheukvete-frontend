// src/features/admin/categories/types.ts

export interface Category {
  id: number;
  name: string;
  type: "MEAL" | "DRINK"; // API response format
}

export type CategoryType = "MEAL" | "DRINK"; // UI dropdown format

// Request type for adding a new category
export interface AddCategoryRequest {
  categoryName: string; // API expects categoryName
  categoryType: CategoryType;
}

// Request type for editing a category
export interface EditCategoryRequest {
  categoryName: string;
  categoryType: CategoryType;
}

// If the API returns the created/updated category, you can define a response type
export interface CategoryResponse extends Category {}