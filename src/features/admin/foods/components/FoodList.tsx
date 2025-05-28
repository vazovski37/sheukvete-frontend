// src/features/admin/foods/components/FoodList.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminFoods } from "../hooks/useAdminFoods"; // Corrected import
import type { AdminFoodData, FoodItemAdmin } from "../types"; // Corrected import
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner"; // For potential delete confirmation feedback

export function FoodList() {
  const router = useRouter();
  const {
    foodsData, // This holds the grouped data: { type, category: { id, name, type, food: FoodItemAdmin[] } }[]
    loadingFoods,
    deleteFood,
    isDeletingFood,
  } = useAdminFoods();

  const handleDelete = async (foodId: number, foodName: string) => {
    // Basic confirmation, you can replace with a nicer Shadcn Dialog
    if (window.confirm(`Are you sure you want to delete "${foodName}"?`)) {
      try {
        await deleteFood(foodId);
        // Success toast is handled by the hook
      } catch (error) {
        // Error toast is handled by the hook
      }
    }
  };

  const handleEdit = (foodId: number) => {
    router.push(`/admin/foods/edit/${foodId}`);
  };

  if (loadingFoods) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex flex-row sm:flex-row justify-between items-start sm:items-center gap-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="overflow-x-auto px-2 pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {[...Array(4)].map((_, j) => <TableHead key={j}><Skeleton className="h-4 w-full" /></TableHead>)}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(2)].map((_, k) => (
                      <TableRow key={k}>
                        {[...Array(4)].map((_, l) => <TableCell key={l}><Skeleton className="h-5 w-full" /></TableCell>)}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-row sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-lg sm:text-2xl font-bold">🍔 Foods & Drinks</h1>
        <Button size="sm" onClick={() => router.push("/admin/foods/add")}>
          + Add New Food
        </Button>
      </div>

      {foodsData.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No food items found. Add some categories and then add food items.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {foodsData.map((categoryGroup: AdminFoodData) => (
            <Card key={`${categoryGroup.type}-${categoryGroup.category.id}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                  {categoryGroup.type === "MEAL" ? "🍽️ Meal" : "🥤 Drink"} – {categoryGroup.category.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto px-2 pt-0">
                {categoryGroup.category.food.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-3 px-1">No items in this category.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs whitespace-nowrap">Name</TableHead>
                        <TableHead className="text-xs whitespace-nowrap">Price</TableHead>
                        <TableHead className="text-xs">Comments</TableHead>
                        <TableHead className="text-xs text-right whitespace-nowrap">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoryGroup.category.food.map((food: FoodItemAdmin) => (
                        <TableRow key={food.id}>
                          <TableCell className="text-sm font-medium py-2">{food.name}</TableCell>
                          <TableCell className="text-sm py-2">${food.price.toFixed(2)}</TableCell>
                          <TableCell className="text-xs py-2 max-w-[150px] truncate">
                            {[food.comment1, food.comment2, food.comment3, food.comment4]
                              .filter(Boolean)
                              .join(" / ") || <span className="text-muted-foreground">-</span>}
                          </TableCell>
                          <TableCell className="text-right py-1.5">
                            <div className="flex justify-end items-center gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs px-2"
                                onClick={() => handleEdit(food.id)}
                                disabled={isDeletingFood}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-7 text-xs px-2"
                                onClick={() => handleDelete(food.id, food.name)}
                                disabled={isDeletingFood}
                              >
                                {isDeletingFood ? "..." : "Del"}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}