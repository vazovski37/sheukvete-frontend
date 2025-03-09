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
  const [categoryType, setCategoryType] = useState<CategoryType | undefined>(); // Use `undefined` instead of empty string
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Fetch all categories
  const { categories, loading } = useCategories();
  const { handleAddFood } = useFoods();

  // Filter categories dynamically based on selected type
  const filteredCategories = categoryType
    ? categories.filter((cat) => cat.type === (categoryType === "MEAL" ? "MEAL" : "DRINK"))
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory) {
      alert("Please select a category.");
      return;
    }

    await handleAddFood({
      name: foodName,
      categoryId: selectedCategory,
      price: parseFloat(price),
    });

    router.push("/admin/foods");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Food Item</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Select Food Type */}
        <div>
          <Label>Food Type</Label>
          <Select value={categoryType ?? ""} onValueChange={(value) => setCategoryType(value as CategoryType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MEALS">Meals</SelectItem>
              <SelectItem value="DRINKS">Drinks</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Select Category (Filtered by Type) */}
        {categoryType && (
          <div>
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

        {/* Input for Food Name */}
        <div>
          <Label>Food Name</Label>
          <Input type="text" value={foodName} onChange={(e) => setFoodName(e.target.value)} required />
        </div>

        {/* Input for Price */}
        <div>
          <Label>Price ($)</Label>
          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={!categoryType || !selectedCategory}>
          Add Food
        </Button>
      </form>
    </div>
  );
}
