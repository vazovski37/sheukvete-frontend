import { useState, useEffect } from "react";
import { fetchFoodsForWaiters } from "@/services/waiterService";
import { WaiterFoodResponse } from "@/types/waiter/food";
import { toast } from "sonner";

export function useWaiterFoods() {
  const [foods, setFoods] = useState<WaiterFoodResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadFoods() {
      try {
        setLoading(true);
        const foodData = await fetchFoodsForWaiters();
        setFoods(foodData);
      } catch (error) {
        toast.error("Failed to load foods");
        setFoods({ meals: [], drinks: [] });
      } finally {
        setLoading(false);
      }
    }
    loadFoods();
  }, []);

  return { foods, loading };
}
