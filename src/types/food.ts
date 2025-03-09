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
  food: FoodItem[]; // Correctly define the array of food items
}

export interface FoodData {
  type: "MEAL" | "DRINK";
  category: FoodCategory;
}



export interface FoodItemm {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
    type: string;
  };
  price: number;
  comments: string[];
}