"use client";

import { useOrdersManagement } from "@/hooks/useOrdersManagement";
import { useWaiterFoods } from "@/hooks/useWaiterFoods";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Minus, Plus } from "lucide-react";
import { OrderItem, OrderRequestItem } from "@/types/order";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { FoodItemm } from "@/types/food";

export default function OrderPage() {
  const { tableId } = useParams();
  const router = useRouter();
  const { order, loadOrder, handleUpdateOrder, loading } = useOrdersManagement();
  const { foods, loading: foodsLoading } = useWaiterFoods();

  const [newItems, setNewItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    if (tableId) loadOrder(Number(tableId));
  }, [tableId]);

  const handleAddItem = (food: FoodItemm) => {
    setNewItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.food.id === food.id && item.comment === "");
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { food, quantity: 1, comment: "" }];
    });
  };

  const handleUpdateComment = (index: number, comment: string) => {
    setNewItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, comment } : item))
    );
  };

  const handleQuantityChange = (index: number, delta: number) => {
    setNewItems((prev) =>
      prev
        .map((item, i) =>
          i === index ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleSubmitOrder = async () => {
    if (!tableId || newItems.length === 0) return;

    const formatted: OrderRequestItem[] = newItems.map(({ food, quantity, comment }) => ({
      foodId: food.id,
      quantity,
      comment: comment ?? "",
    }));

    try {
      await handleUpdateOrder(Number(tableId), formatted);
      toast.success("Items added successfully");
      router.push(`/waiter/orders/view/${tableId}`);
    } catch (err) {
      toast.error("Failed to add items.");
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6 max-w-4xl mx-auto space-y-6">
    <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => router.push("/waiter")}
      >
        ← Back
      </Button>
      <h1 className="text-xl sm:text-2xl font-bold">
        ➕ Add Items – Table {tableId}
      </h1>
    </div>



      {(loading || foodsLoading) ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin size-8" />
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">🛒 New Items</CardTitle>
            </CardHeader>
            <CardContent>
              {newItems.length > 0 ? (
                <div className="space-y-4">
                  {newItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border rounded-lg p-3"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.food.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${item.food.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleQuantityChange(index, -1)}
                        >
                          <Minus className="size-4" />
                        </Button>
                        <span className="font-semibold">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleQuantityChange(index, 1)}
                        >
                          <Plus className="size-4" />
                        </Button>
                      </div>

                      <Input
                        className="w-full sm:w-48 text-sm"
                        placeholder="Optional comment"
                        value={item.comment}
                        onChange={(e) => handleUpdateComment(index, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No new items selected yet.</p>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="MEAL">
            <TabsList className="mb-4 flex gap-4 overflow-x-auto">
              <TabsTrigger value="MEAL">🍽️ Meals</TabsTrigger>
              <TabsTrigger value="DRINK">🥤 Drinks</TabsTrigger>
            </TabsList>

            <TabsContent value="MEAL">
              <div className="space-y-6">
                {foods?.meals?.map((category) => (
                  <div key={category.category.id}>
                    <h3 className="text-base font-semibold mb-2">{category.category.name}</h3>
                    <div className="flex flex-col gap-3">
                      {category.food.map((food) => (
                        <button
                          key={food.id}
                          onClick={() => handleAddItem(food as FoodItemm )}
                          className="p-3 border rounded hover:bg-muted text-left"
                        >
                          <p className="font-medium">{food.name}</p>
                          <p className="text-xs text-muted-foreground">${food.price.toFixed(2)}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="DRINK">
              <div className="space-y-6">
                {foods?.drinks?.map((category) => (
                  <div key={category.category.id}>
                    <h3 className="text-base font-semibold mb-2">{category.category.name}</h3>
                    <div className="flex flex-col gap-3">
                      {category.food.map((food) => (
                        <button
                          key={food.id}
                          onClick={() => handleAddItem(food as FoodItemm )}
                          className="p-3 border rounded hover:bg-muted text-left"
                        >
                          <p className="font-medium">{food.name}</p>
                          <p className="text-xs text-muted-foreground">${food.price.toFixed(2)}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <Button
            className="w-full sm:w-auto mt-4"
            size="lg"
            onClick={handleSubmitOrder}
            disabled={newItems.length === 0}
          >
            ✅ Add to Order & Redirect
          </Button>
        </>
      )}
    </div>
  );
}
