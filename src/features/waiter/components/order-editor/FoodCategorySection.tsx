// src/features/waiter/components/order-editor/FoodCategorySection.tsx
import React from "react";
import type { WaiterDisplayCategoryWithFoods, WaiterDisplayFoodItem } from "../../../waiter/types";
import { FoodMenuItemCard } from "./FoodMenuItemCard";
import { Skeleton } from "@/components/ui/skeleton";

interface FoodCategorySectionProps {
  categoryWithFoods: WaiterDisplayCategoryWithFoods;
  onAddItem: (food: WaiterDisplayFoodItem) => void;
  onAddCommentedItem: (food: WaiterDisplayFoodItem, comment: string) => void;
}

export function FoodCategorySection({ categoryWithFoods, onAddItem, onAddCommentedItem }: FoodCategorySectionProps) {
  return (
    <div className="mb-4">
      <h3 className="font-semibold text-md mb-2 sticky top-0 bg-background/95 backdrop-blur-sm py-1.5 z-10 px-1">
        {categoryWithFoods.category.name}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {categoryWithFoods.food.map(food => (
          <FoodMenuItemCard
            key={food.id}
            food={food}
            onAddItem={onAddItem}
            onAddCommentedItem={onAddCommentedItem}
          />
        ))}
      </div>
    </div>
  );
}

interface FoodListRendererProps {
  foodCategories: WaiterDisplayCategoryWithFoods[] | undefined;
  categoryType: "Meals" | "Drinks";
  isLoading: boolean;
  onAddItem: (food: WaiterDisplayFoodItem) => void;
  onAddCommentedItem: (food: WaiterDisplayFoodItem, comment: string) => void;
}

export function FoodListRenderer({ foodCategories, categoryType, isLoading, onAddItem, onAddCommentedItem }: FoodListRendererProps) {
  if (isLoading && !foodCategories) {
    return (
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
    );
  }
  if (!foodCategories || foodCategories.length === 0) {
    return <p className="text-muted-foreground text-sm p-4 text-center">No {categoryType.toLowerCase()} available.</p>;
  }

  return (
    <>
      {foodCategories.map(catWithFoods => (
        <FoodCategorySection
          key={catWithFoods.category.id}
          categoryWithFoods={catWithFoods}
          onAddItem={onAddItem}
          onAddCommentedItem={onAddCommentedItem}
        />
      ))}
    </>
  );
}