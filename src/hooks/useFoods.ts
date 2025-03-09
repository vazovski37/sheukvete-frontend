import { useEffect, useState } from "react";
import { fetchFoods, addFood, deleteFood } from "@/services/foodService";
import { FoodData } from "@/types/food";
import { toast } from "sonner";

export function useFoods() {
  const [foods, setFoods] = useState<FoodData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchFoods()
      .then((data: FoodData[]) => setFoods(data))
      .catch(() => toast.error("Failed to fetch foods"))
      .finally(() => setLoading(false));
  }, []);

  const handleAddFood = async (data: { name: string; categoryId: number; price: number }) => {
    try {
      await addFood(data);
      toast.success("Food added successfully!");
    } catch {
      toast.error("Failed to add food.");
    }
  };

  const handleDeleteFood = async (id: number) => {
    try {
      await deleteFood(id);
      toast.success("Food deleted successfully!");
      setFoods((prev) =>
        prev.map((category) => ({
          ...category,
          category: {
            ...category.category,
            food: category.category.food.filter((food) => food.id !== id),
          },
        }))
      );
    } catch {
      toast.error("Failed to delete food.");
    }
  };

  return { foods, loading, handleAddFood, handleDeleteFood };
}
