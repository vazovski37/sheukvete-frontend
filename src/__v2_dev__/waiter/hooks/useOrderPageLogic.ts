// src/features/waiter/hooks/useOrderPageLogic.ts

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useOrdersManagement } from "@/hooks/useOrdersManagement";
import { useWaiterFoods } from "@/hooks/useWaiterFoods";
import { FoodItem } from "@/types/waiter/food";
import { OrderItem, OrderRequestItem } from "@/types/order";

export function useOrderPageLogic() {
  const { tableId } = useParams();
  const router = useRouter();

  const {
    order,
    loading,
    loadOrder,
    handleUpdateOrder,
    handleCreateOrder, // ← you must expose this inside useOrdersManagement
  } = useOrdersManagement();

  const { foods, loading: foodsLoading } = useWaiterFoods();

  const [initialItems, setInitialItems] = useState<OrderItem[]>([]);
  const [updatedItems, setUpdatedItems] = useState<OrderItem[]>([]);

  // Load or create the order
  useEffect(() => {
    if (!tableId) return;

    const load = async () => {
      const success = await loadOrder(Number(tableId));
      if (!success) {
        await handleCreateOrder(Number(tableId), []);
        toast.info("New order started for this table.");
        await loadOrder(Number(tableId));
      }
    };

    load();
  }, [tableId]);

  // Sync order items
  useEffect(() => {
    if (order) {
      setInitialItems(order.items || []);
      setUpdatedItems((prev) => {
        const merged = [...prev];
        order.items.forEach((item) => {
          const exists = merged.find(
            (x) => x.food.id === item.food.id && x.comment === item.comment
          );
          if (!exists) merged.push(item);
        });
        return merged;
      });
    }
  }, [order]);

  const addItem = (food: FoodItem) => {
    setUpdatedItems((prev) => [...prev, { food, quantity: 1, comment: "" }]);
  };

  const modifyQuantity = (index: number, change: number) => {
    setUpdatedItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const initial = initialItems.find(
          (x) => x.food.id === item.food.id && x.comment === item.comment
        );
        const min = initial?.quantity ?? 1;
        return { ...item, quantity: Math.max(min, item.quantity + change) };
      })
    );
  };

  const removeItem = (index: number) => {
    setUpdatedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateComment = (index: number, comment: string) => {
    setUpdatedItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, comment } : item))
    );
  };

  const submit = async () => {
    if (!tableId) return;

    const formatted: OrderRequestItem[] = updatedItems.map(({ food, quantity, comment }) => ({
      foodId: food.id,
      quantity,
      comment: comment || "",
    }));

    await handleUpdateOrder(Number(tableId), formatted);
    toast.success("Order updated");
  };

  return {
    tableId: Number(tableId),
    router,
    loading,
    foodsLoading,
    meals: foods?.meals || [],
    drinks: foods?.drinks || [],
    orderItems: updatedItems,
    addItem,
    modifyQuantity,
    removeItem,
    updateComment,
    submit,
    back: () => router.push("/waiter"),
  };
}
