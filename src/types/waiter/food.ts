export interface FoodItem {
  id: number;
  name: string;
  price: number;
  comment1?: string;
  comment2?: string;
  comment3?: string;
  comment4?: string;
}

export interface FoodCategory {
  id: number;
  name: string;
  type: "MEAL" | "DRINK";
}

export interface CategoryWithFoods {
  category: FoodCategory;
  food: FoodItem[];
}

export interface WaiterFoodResponse {
  meals: CategoryWithFoods[];
  drinks: CategoryWithFoods[];
}
