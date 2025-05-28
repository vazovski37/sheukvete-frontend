// src/features/waiter/components/OrderPageUI.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Minus, Plus, Trash } from "lucide-react";
import { CategoryWithFoods, FoodItem } from "@/types/waiter/food";
import { OrderItem } from "@/types/order";

interface Props {
  tableId: number;
  loading: boolean;
  foodsLoading: boolean;
  orderItems: OrderItem[];
  meals: CategoryWithFoods[];
  drinks: CategoryWithFoods[];
  onBack: () => void;
  onSubmit: () => void;
  onAddItem: (food: FoodItem) => void;
  onModifyQuantity: (index: number, change: number) => void;
  onRemoveItem: (index: number) => void;
  onUpdateComment: (index: number, comment: string) => void;
}

export const OrderPageUI = ({
  tableId,
  loading,
  foodsLoading,
  orderItems,
  meals,
  drinks,
  onBack,
  onSubmit,
  onAddItem,
  onModifyQuantity,
  onRemoveItem,
  onUpdateComment,
}: Props) => {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">🍽️ Order for Table {tableId}</h1>

      <Button className="mb-4" onClick={onBack} variant="secondary">
        🔙 Back to Tables
      </Button>

      {loading || foodsLoading ? (
        <div className="flex justify-center my-6">
          <Loader2 className="animate-spin size-8" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>🛒 Current Order</CardTitle>
            </CardHeader>
            <CardContent>
              {orderItems.length > 0 ? (
                <div className="space-y-4">
                  {orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.food.name}</p>
                        <p className="text-sm text-muted-foreground">${item.food.price.toFixed(2)}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onModifyQuantity(index, -1)}
                        >
                          <Minus className="size-4" />
                        </Button>
                        <span className="text-lg font-bold">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onModifyQuantity(index, 1)}
                        >
                          <Plus className="size-4" />
                        </Button>
                      </div>

                      <Input
                        className="w-full sm:w-32 text-sm"
                        placeholder="Add comment..."
                        value={item.comment}
                        onChange={(e) => onUpdateComment(index, e.target.value)}
                      />

                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => onRemoveItem(index)}
                      >
                        <Trash className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No items in order yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Food Selector */}
          <Tabs defaultValue="MEAL">
            <TabsList className="mb-4 flex gap-4 overflow-x-auto">
              <TabsTrigger value="MEAL">🍽️ Meals</TabsTrigger>
              <TabsTrigger value="DRINK">🥤 Drinks</TabsTrigger>
            </TabsList>

            <TabsContent value="MEAL">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {meals?.map((category) => (
                  <Card key={category.category.id} className="p-4">
                    <CardTitle className="text-sm font-medium mb-2">
                      {category.category.name}
                    </CardTitle>
                    <CardContent className="space-y-2 p-0">
                      {category.food.map((food) => (
                        <div
                          key={food.id}
                          className="p-3 border rounded hover:bg-muted cursor-pointer"
                          onClick={() => onAddItem(food)}
                        >
                          <p className="font-medium">{food.name}</p>
                          <p className="text-xs text-muted-foreground">${food.price.toFixed(2)}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="DRINK">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {drinks?.map((category) => (
                  <Card key={category.category.id} className="p-4">
                    <CardTitle className="text-sm font-medium mb-2">
                      {category.category.name}
                    </CardTitle>
                    <CardContent className="space-y-2 p-0">
                      {category.food.map((food) => (
                        <div
                          key={food.id}
                          className="p-3 border rounded hover:bg-muted cursor-pointer"
                          onClick={() => onAddItem(food as FoodItem)}
                        >
                          <p className="font-medium">{food.name}</p>
                          <p className="text-xs text-muted-foreground">${food.price.toFixed(2)}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <Button className="w-full mt-4" size="lg" onClick={onSubmit}>
            ✅ Confirm Additional Items
          </Button>
        </div>
      )}
    </div>
  );
};
