// src/features/waiter/components/order-editor/FoodMenuTabs.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FoodListRenderer } from "./FoodCategorySection";
import type { WaiterDisplayCategoryWithFoods, WaiterDisplayFoodItem } from "../../../waiter/types";

interface FoodMenuTabsProps {
  availableFoods: {
    meals?: WaiterDisplayCategoryWithFoods[];
    drinks?: WaiterDisplayCategoryWithFoods[];
  } | undefined;
  isLoadingFoods: boolean;
  onAddItem: (food: WaiterDisplayFoodItem) => void;
  onAddCommentedItem: (food: WaiterDisplayFoodItem, comment: string) => void;
}

export function FoodMenuTabs({ availableFoods, isLoadingFoods, onAddItem, onAddCommentedItem }: FoodMenuTabsProps) {
  return (
    <Card className="shadow-md">
      <CardHeader className="p-3 sm:p-4 border-b">
        <CardTitle className="text-lg">Menu</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="meals" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-11 rounded-none border-b">
            <TabsTrigger value="meals" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Meals</TabsTrigger>
            <TabsTrigger value="drinks" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Drinks</TabsTrigger>
          </TabsList>
          <ScrollArea className="h-[calc(100vh-260px)] sm:h-[calc(100vh-230px)]">
            <div className="p-3 sm:p-4">
              <TabsContent value="meals" className="mt-0">
                <FoodListRenderer
                  foodCategories={availableFoods?.meals}
                  categoryType="Meals"
                  isLoading={isLoadingFoods}
                  onAddItem={onAddItem}
                  onAddCommentedItem={onAddCommentedItem}
                />
              </TabsContent>
              <TabsContent value="drinks" className="mt-0">
                <FoodListRenderer
                  foodCategories={availableFoods?.drinks}
                  categoryType="Drinks"
                  isLoading={isLoadingFoods}
                  onAddItem={onAddItem}
                  onAddCommentedItem={onAddCommentedItem}
                />
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}