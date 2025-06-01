// src/features/waiter/components/order-editor/FoodMenuItemCard.tsx
import React from "react";
import type { WaiterDisplayFoodItem } from "../../../waiter/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

interface FoodMenuItemCardProps {
  food: WaiterDisplayFoodItem;
  onAddItem: (food: WaiterDisplayFoodItem) => void;
  onAddCommentedItem: (food: WaiterDisplayFoodItem, comment: string) => void;
}

export function FoodMenuItemCard({ food, onAddItem, onAddCommentedItem }: FoodMenuItemCardProps) {
  const presetComments = [food.comment1, food.comment2, food.comment3, food.comment4].filter(Boolean) as string[];

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-3">
        <div className="flex justify-between items-start gap-2">
          <div>
            <p className="font-medium text-sm truncate">{food.name}</p>
            <p className="text-xs text-muted-foreground">${food.price.toFixed(2)}</p>
          </div>
          <Button aria-label={`Add ${food.name}`} size="icon" variant="ghost" onClick={() => onAddItem(food)} className="h-8 w-8 shrink-0">
            <PlusCircle className="h-5 w-5 text-primary" />
          </Button>
        </div>
        {presetComments.length > 0 && (
          <div className="mt-2 space-x-1 space-y-1">
            {presetComments.map((pc, idx) => (
              <Button key={idx} variant="outline" size="sm" className="text-[0.65rem] h-auto py-0.5 px-1.5" onClick={() => onAddCommentedItem(food, pc)}>
                + "{pc}"
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}