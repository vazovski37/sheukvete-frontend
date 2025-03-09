"use client";

import { useOrdersManagement } from "@/hooks/useOrdersManagement";
import { useWaiterFoods } from "@/hooks/useWaiterFoods"; 
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Plus, Minus, Trash } from "lucide-react";
import { OrderItem, OrderRequestItem } from "@/types/order";
import { FoodItem, CategoryWithFoods } from "@/types/waiter/food";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export default function OrderPage() {
  const { tableId } = useParams();
  const router = useRouter();
  const { order, loadOrder, handleUpdateOrder, loading } = useOrdersManagement();

  const { foods, loading: foodsLoading } = useWaiterFoods();

  const [initialOrderItems, setInitialOrderItems] = useState<OrderItem[]>([]); // Store original order
  const [updatedOrderItems, setUpdatedOrderItems] = useState<OrderItem[]>([]); // Store modified order

  useEffect(() => {
    if (tableId) {
      loadOrder(Number(tableId));
    }
  }, [tableId, loadOrder]);
  

  useEffect(() => {
    if (order) {
      setInitialOrderItems(order.items || []); // Store original items
      setUpdatedOrderItems(order.items || []); // Initialize updated order
    }
  }, [order]);

  // Handle adding new food items - Separate items by comment
  const handleAddItem = (food: FoodItem) => {
    setUpdatedOrderItems((prevItems) => {
      return [...prevItems, { food, quantity: 1, comment: "" } as OrderItem]; // ✅ Fix type issue
    });
  };
  

  // Modify quantity (prevent decreasing below initial quantity)
  const handleModifyQuantity = (index: number, change: number) => {
    setUpdatedOrderItems((prevItems) =>
      prevItems.map((item, idx) => {
        if (idx === index) {
          const initialItem = initialOrderItems.find((init) => init.food.id === item.food.id && init.comment === item.comment);
          const minQuantity = initialItem ? initialItem.quantity : 1; // Prevent decrease below initial quantity

          return { ...item, quantity: Math.max(minQuantity, item.quantity + change) };
        }
        return item;
      })
    );
  };

  // Remove only newly added items
  const handleRemoveItem = (index: number) => {
    setUpdatedOrderItems((prevItems) => prevItems.filter((_, idx) => idx !== index));
  };

  // Update item comment
  const handleUpdateComment = (index: number, comment: string) => {
    setUpdatedOrderItems((prevItems) =>
      prevItems.map((item, idx) => (idx === index ? { ...item, comment } : item))
    );
  };

  const handleSubmitOrder = async () => {
    if (!tableId) return;
  
    // ✅ Convert `updatedOrderItems` into `OrderRequestItem[]`
    const formattedOrder: OrderRequestItem[] = updatedOrderItems.map((item) => ({
      foodId: item.food.id,
      quantity: item.quantity,
      comment: item.comment || "",
    }));
  
    if (formattedOrder.length === 0) {
      toast.info("No additional items to send.");
      return;
    }
  
    await handleUpdateOrder(Number(tableId), formattedOrder); // ✅ Now correctly typed
    toast.success("Order updated successfully!");
  };
  
  
  
  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🍽️ Order for Table {tableId}</h1>

      <Button className="mb-4" onClick={() => router.push("/waiter/")}>
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
              {updatedOrderItems.length > 0 ? (
                <div className="space-y-4">
                  {updatedOrderItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.food.name}</p>
                        <p className="text-sm text-gray-500">${item.food.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleModifyQuantity(index, -1)}
                          disabled={item.quantity <= (initialOrderItems.find((init) => init.food.id === item.food.id && init.comment === item.comment)?.quantity || 1)}
                        >
                          <Minus className="size-4" />
                        </Button>
                        <span className="text-lg font-bold">{item.quantity}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleModifyQuantity(index, 1)}>
                          <Plus className="size-4" />
                        </Button>
                      </div>
                      <Input
                        className="w-32 text-sm"
                        placeholder="Add comment..."
                        value={item.comment}
                        onChange={(e) => handleUpdateComment(index, e.target.value)}
                      />
                      <Button variant="destructive" size="icon" onClick={() => handleRemoveItem(index)}>
                        <Trash className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No items in order yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Food Selection */}
          <Tabs defaultValue="MEAL">
            <TabsList className="mb-4 flex space-x-4">
              <TabsTrigger value="MEAL">🍽️ Meals</TabsTrigger>
              <TabsTrigger value="DRINK">🥤 Drinks</TabsTrigger>
            </TabsList>

            <TabsContent value="MEAL">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {foods?.meals?.map((category: CategoryWithFoods) => (
                  <Card key={category.category.id} className="p-4">
                    <CardTitle>{category.category.name}</CardTitle>
                    <CardContent className="space-y-2">
                      {category.food.map((food) => (
                        <div key={food.id} className="p-3 border rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => handleAddItem(food)}>
                          <p className="font-medium">{food.name}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="DRINK">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {foods?.drinks?.map((category: CategoryWithFoods) => (
                  <Card key={category.category.id} className="p-4">
                    <CardTitle className="text-lg font-semibold">{category.category.name}</CardTitle>
                    <CardContent className="space-y-2">
                      {category.food.map((food) => (
                        <div
                          key={food.id}
                          className="p-3 border rounded-lg hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleAddItem(food)}
                        >
                          <p className="font-medium">{food.name}</p>
                          <p className="text-sm text-gray-500">${food.price.toFixed(2)}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <Button className="w-full" onClick={handleSubmitOrder}>
            ✅ Confirm Additional Items
          </Button>
        </div>
      )}
    </div>
  );
}
