// src/features/admin/foods/types.ts

// Basic Food Item structure used in listings and forms
export interface FoodItemAdmin {
  id: number;
  name: string;
  price: number;
  categoryId: number; // For relating back to its category
  categoryName?: string; // Optional: for display purposes if API provides it joined
  categoryType?: "MEAL" | "DRINK"; // Optional: for display
  comment1?: string;
  comment2?: string;
  comment3?: string;
  comment4?: string;
}

// For fetching foods, often they come grouped by category
export interface FoodCategoryAdmin {
  id: number;
  name: string;
  type: "MEAL" | "DRINK";
  food: FoodItemAdmin[];
}

// The structure your useFoods hook and API for fetching all foods expects
export interface AdminFoodData {
  type: "MEAL" | "DRINK"; // This seems to be how your current API groups them
  category: FoodCategoryAdmin;
}

// Request type for adding a new food item
export interface AddFoodRequest {
  name: string;
  categoryId: number;
  price: number;
  comment1?: string;
  comment2?: string;
  comment3?: string;
  comment4?: string;
}

// Request type for editing a food item
export interface EditFoodRequest extends AddFoodRequest {
  // Usually similar to Add, but might differ. For now, extends AddFoodRequest.
  // If price or category cannot be changed, they might be omitted here.
}

// Response type when adding/editing if the API returns the created/updated item
export interface FoodResponse extends FoodItemAdmin {}