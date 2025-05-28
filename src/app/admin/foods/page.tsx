"use client";

import { useFoods } from "@/hooks/useFoods";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FoodData } from "@/types/food";

export default function FoodsPage() {
  const router = useRouter();
  const { foods, loading, handleDeleteFood } = useFoods();

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-row sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-lg sm:text-2xl font-bold">Foods & Drinks</h1>
        <Button size="sm" onClick={() => router.push("/admin/foods/add")}>
          + Add New Food
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map((categoryData: FoodData, index: number) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm sm:text-base font-semibold">
                  {categoryData.type === "MEAL" ? "🍽️ Meal" : "🥤 Drink"} – {categoryData.category.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto px-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Name</TableHead>
                      <TableHead className="text-xs">Price</TableHead>
                      <TableHead className="text-xs">Comments</TableHead>
                      <TableHead className="text-xs">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryData.category.food.map((food) => (
                      <TableRow key={food.id}>
                        <TableCell className="text-sm">{food.name}</TableCell>
                        <TableCell className="text-sm">${food.price.toFixed(2)}</TableCell>
                        <TableCell className="text-xs space-y-1">
                          {[food.comment1, food.comment2, food.comment3, food.comment4].filter(Boolean).map((c, i) => (
                            <p key={i}>📝 {c}</p>
                          ))}
                        </TableCell>
                        <TableCell className="flex flex-col gap-1 text-xs">
                          {/* <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/admin/foods/edit/${food.id}`)}
                          >
                            Edit
                          </Button> */}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteFood(food.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
