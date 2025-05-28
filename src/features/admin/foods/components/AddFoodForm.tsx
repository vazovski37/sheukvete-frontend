// src/features/admin/foods/components/AddFoodForm.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminFoods } from "../hooks/useAdminFoods";
import { useAdminCategories } from "@/features/admin/categories/hooks/useAdminCategories"; // Ensure this path is correct
import type { Category as AdminCategoryType, CategoryType as AdminSelectedCategoryType } from "@/features/admin/categories/types"; // Ensure path is correct
import type { AddFoodRequest } from "../types";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export function AddFoodForm() {
  const router = useRouter();
  const { addFood, isAddingFood } = useAdminFoods();
  const { categories: allCategories, loadingCategories } = useAdminCategories();

  const [foodName, setFoodName] = useState("");
  const [price, setPrice] = useState("");
  const [selectedCategoryType, setSelectedCategoryType] = useState<AdminSelectedCategoryType | "">("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const [comment1, setComment1] = useState("");
  const [comment2, setComment2] = useState("");
  const [comment3, setComment3] = useState("");
  const [comment4, setComment4] = useState("");

  const filteredCategories = useMemo(() => {
    if (selectedCategoryType && allCategories.length > 0) {
      return allCategories.filter(cat => cat.type === selectedCategoryType);
    }
    return [];
  }, [selectedCategoryType, allCategories]);

  // Effect to reset category ID if type changes and selected category is no longer valid
  useEffect(() => {
    if (selectedCategoryType && selectedCategoryId) {
      const isValidCategory = filteredCategories.some(cat => String(cat.id) === selectedCategoryId);
      if (!isValidCategory) {
        setSelectedCategoryId("");
      }
    }
  }, [selectedCategoryType, filteredCategories, selectedCategoryId]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId) {
      toast.error("Please select a category.");
      return;
    }
    if (!foodName.trim()) {
        toast.error("Food name cannot be empty.");
        return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
        toast.error("Please enter a valid price.");
        return;
    }

    const foodData: AddFoodRequest = {
      name: foodName,
      categoryId: Number(selectedCategoryId),
      price: parsedPrice,
      comment1: comment1.trim() || undefined,
      comment2: comment2.trim() || undefined,
      comment3: comment3.trim() || undefined,
      comment4: comment4.trim() || undefined,
    };

    try {
      await addFood(foodData);
      router.push("/admin/foods");
    } catch (error) {
      // Error is handled by the hook's onError and should show a toast
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-lg mx-auto space-y-6">
      <div className="flex flex-row justify-between items-center">
        <Button size="sm" variant="outline" onClick={() => router.push("/admin/foods")}>
          ← Back
        </Button>
        <h1 className="text-xl font-bold"> 🍳 Add New Food/Drink</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div className="space-y-1">
          <Label htmlFor="foodType">Type (Meal/Drink)</Label>
          <Select
            value={selectedCategoryType}
            onValueChange={(value) => setSelectedCategoryType(value as AdminSelectedCategoryType | "")}
            disabled={isAddingFood || loadingCategories}
          >
            <SelectTrigger id="foodType" className="text-sm">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MEAL">Meal</SelectItem>
              <SelectItem value="DRINK">Drink</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loadingCategories && selectedCategoryType && (
            <Skeleton className="h-10 w-full" />
        )}

        {!loadingCategories && selectedCategoryType && (
          <div className="space-y-1">
            <Label htmlFor="category">Category</Label>
            <Select
              value={selectedCategoryId}
              onValueChange={setSelectedCategoryId}
              disabled={isAddingFood || filteredCategories.length === 0}
            >
              <SelectTrigger id="category" className="text-sm">
                <SelectValue placeholder={
                    filteredCategories.length === 0 && selectedCategoryType ? 
                    `No ${selectedCategoryType.toLowerCase()} categories` : 
                    "Select Category"
                } />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat: AdminCategoryType) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    {selectedCategoryType ? `No ${selectedCategoryType.toLowerCase()} categories found` : "Select type first"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-1">
          <Label htmlFor="foodName">Food Name</Label>
          <Input
            id="foodName" type="text" value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            required placeholder="e.g. Cheeseburger" disabled={isAddingFood}
            className="text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price" type="number" value={price}
            onChange={(e) => setPrice(e.target.value)}
            required placeholder="e.g. 4.99" min="0" step="0.01" disabled={isAddingFood}
            className="text-sm"
          />
        </div>

        {[
          { label: "Optional Comment 1", value: comment1, setter: setComment1 },
          { label: "Optional Comment 2", value: comment2, setter: setComment2 },
          { label: "Optional Comment 3", value: comment3, setter: setComment3 },
          { label: "Optional Comment 4", value: comment4, setter: setComment4 },
        ].map((commentField, index) => (
            <div className="space-y-1" key={`comment-${index}`}>
                <Label htmlFor={`comment${index + 1}`}>{commentField.label}</Label>
                <Input
                    id={`comment${index + 1}`} type="text"
                    value={commentField.value}
                    onChange={(e) => commentField.setter(e.target.value)}
                    placeholder={`Preset comment ${index + 1}`} disabled={isAddingFood}
                    className="text-sm"
                />
            </div>
        ))}

        <Button type="submit" className="w-full" disabled={isAddingFood || !selectedCategoryId || loadingCategories}>
          {isAddingFood ? "Adding..." : "✅ Add Food Item"}
        </Button>
      </form>
    </div>
  );
}