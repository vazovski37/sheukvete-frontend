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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Foods & Drinks</h1>

      <Button className="mb-4" onClick={() => router.push("/admin/foods/add")}>
        + Add New Food
      </Button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {foods.map((categoryData: FoodData, index: number) => (
            <Card key={index} className="w-full md:w-[48%] lg:w-[32%]">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {categoryData.type === "MEAL" ? "🍽️ Meal" : "🥤 Drink"} - {categoryData.category.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryData.category.food.map((food) => (
                      <TableRow key={food.id}>
                        <TableCell>{food.name}</TableCell>
                        <TableCell>${food.price.toFixed(2)}</TableCell>
                        <TableCell>
                          {food.comment1 && <p>📝 {food.comment1}</p>}
                          {food.comment2 && <p>📝 {food.comment2}</p>}
                          {food.comment3 && <p>📝 {food.comment3}</p>}
                          {food.comment4 && <p>📝 {food.comment4}</p>}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" onClick={() => router.push(`/admin/foods/edit/${food.id}`)}>
                            Edit
                          </Button>
                          <Button variant="destructive" onClick={() => handleDeleteFood(food.id)}>
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
