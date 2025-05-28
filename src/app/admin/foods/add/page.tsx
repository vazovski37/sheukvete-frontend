"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCategories } from "@/hooks/useCategories";
import { useFoods } from "@/hooks/useFoods";
import { Category, CategoryType } from "@/types/category";

export default function AddFoodPage() {
  const router = useRouter();
  const [foodName, setFoodName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryType, setCategoryType] = useState<CategoryType | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const { categories, loading } = useCategories();
  const { handleAddFood } = useFoods();

  const filteredCategories = categoryType
    ? categories.filter((cat) => cat.type === categoryType)
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return alert("Please select a category.");

    await handleAddFood({
      name: foodName,
      categoryId: selectedCategory,
      price: parseFloat(price),
    });

    router.push("/admin/foods");
  };

  return (
    <div className="p-4 sm:p-6 max-w-md mx-auto space-y-6">
      <div className="flex flex-row justify-between items-center">
        <Button size="sm" variant="outline" onClick={() => router.back()}>
          ← Back
        </Button>
        <h1 className="text-xl font-bold mt-4"> Add New Food</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        {/* Food Type */}
        <div className="space-y-1">
          <Label>Food Type</Label>
          <Select value={categoryType ?? ""} onValueChange={(value) => setCategoryType(value as CategoryType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MEAL">Meals</SelectItem>
              <SelectItem value="DRINK">Drinks</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        {categoryType && (
          <div className="space-y-1">
            <Label>Category</Label>
            <Select
              value={selectedCategory ? selectedCategory.toString() : ""}
              onValueChange={(value) => setSelectedCategory(Number(value))}
              disabled={loading || filteredCategories.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={loading ? "Loading..." : "Select Category"} />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat: Category) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>No categories found</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Food Name */}
        <div className="space-y-1">
          <Label>Food Name</Label>
          <Input
            type="text"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            required
            placeholder="e.g. Cheeseburger"
          />
        </div>

        {/* Price */}
        <div className="space-y-1">
          <Label>Price ($)</Label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            placeholder="e.g. 4.99"
            min="0"
            step="0.01"
          />
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={!categoryType || !selectedCategory}>
          ✅ Add Food
        </Button>
      </form>
    </div>
  );
}
