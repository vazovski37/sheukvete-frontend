export interface Category {
    id: number;
    name: string;
    type: "MEAL" | "DRINK"; // API response format
  }
  
  export type CategoryType = "MEAL" | "DRINK"; // UI dropdown format
  
  export interface AddCategoryRequest {
    categoryName: string; // API expects categoryName
    categoryType: "MEAL" | "DRINK";
  }
  
  export interface EditCategoryRequest {
    categoryName: string;
    categoryType: "MEAL" | "DRINK";
  }
  