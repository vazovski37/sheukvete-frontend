// src/features/admin/foods/components/EditFoodForm.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminFoods } from "../hooks/useAdminFoods";
import { useAdminCategories } from "@/features/admin/categories/hooks/useAdminCategories";
import type { Category as AdminCategoryType, CategoryType as AdminSelectedCategoryType } from "@/features/admin/categories/types";
import type { FoodItemAdmin, EditFoodRequest } from "../types";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface EditFoodFormProps {
  foodId: number;
}

export function EditFoodForm({ foodId }: EditFoodFormProps) {
  const router = useRouter();
  const { foodsData, editFood, isEditingFood, loadingFoods: loadingAdminFoods } = useAdminFoods();
  const { categories: allCategories, loadingCategories } = useAdminCategories();

  const [foodName, setFoodName] = useState("");
  const [price, setPrice] = useState("");
  const [selectedCategoryType, setSelectedCategoryType] = useState<AdminSelectedCategoryType | "">("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [comment1, setComment1] = useState("");
  const [comment2, setComment2] = useState("");
  const [comment3, setComment3] = useState("");
  const [comment4, setComment4] = useState("");
  
  const [initialFood, setInitialFood] = useState<FoodItemAdmin | undefined>(undefined);
  const [isFormLoading, setIsFormLoading] = useState(true);

  useEffect(() => {
    if (!loadingAdminFoods && !loadingCategories && foodsData.length > 0 && allCategories.length > 0) {
      let foundFood: FoodItemAdmin | undefined;
      for (const catData of foodsData) {
        foundFood = catData.category.food.find(f => f.id === foodId);
        if (foundFood) {
          setInitialFood(foundFood);
          setFoodName(foundFood.name);
          setPrice(foundFood.price.toString());
          setSelectedCategoryId(foundFood.categoryId.toString());
          
          const parentCategory = allCategories.find(c => c.id === foundFood?.categoryId);
          if (parentCategory) {
              setSelectedCategoryType(parentCategory.type);
          }
          setComment1(foundFood.comment1 || "");
          setComment2(foundFood.comment2 || "");
          setComment3(foundFood.comment3 || "");
          setComment4(foundFood.comment4 || "");
          break;
        }
      }
      setIsFormLoading(false);
    } else if (!loadingAdminFoods && !loadingCategories) { // Data loaded but food not found or categories empty
        setIsFormLoading(false);
    }
  }, [foodId, foodsData, loadingAdminFoods, allCategories, loadingCategories]);

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
    const foodData: EditFoodRequest = {
      name: foodName,
      categoryId: Number(selectedCategoryId),
      price: parsedPrice,
      comment1: comment1.trim() || undefined,
      comment2: comment2.trim() || undefined,
      comment3: comment3.trim() || undefined,
      comment4: comment4.trim() || undefined,
    };
    try {
      await editFood({ id: foodId, data: foodData });
      router.push("/admin/foods");
    } catch (error) {
      // Error handled by hook
    }
  };

  if (isFormLoading) {
    return (
        <div className="p-4 sm:p-6 max-w-lg mx-auto space-y-6">
            <div className="flex justify-between items-center"><Skeleton className="h-8 w-20" /><Skeleton className="h-8 w-32" /></div>
            <div className="space-y-4">
                {[...Array(7)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                <Skeleton className="h-10 w-24 mt-2" />
            </div>
        </div>
    );
  }

  if (!initialFood) {
    return <p className="text-center text-red-500 py-10">Food item not found or initial data could not be loaded.</p>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-lg mx-auto space-y-6">
      <div className="flex flex-row justify-between items-center">
        <Button size="sm" variant="outline" onClick={() => router.push("/admin/foods")}>
          ← Back
        </Button>
        <h1 className="text-xl font-bold">✏️ Edit Food/Drink</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div className="space-y-1">
          <Label htmlFor="foodType">Type (Meal/Drink)</Label>
          <Select
            value={selectedCategoryType}
            onValueChange={(value) => {
              setSelectedCategoryType(value as AdminSelectedCategoryType | "");
              // Do not reset selectedCategoryId here if the type matches the initial food's category type
            }}
            disabled={isEditingFood || loadingCategories}
          >
            <SelectTrigger id="foodType" className="text-sm"><SelectValue placeholder="Select Type" /></SelectTrigger>
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
              disabled={isEditingFood || filteredCategories.length === 0}
            >
              <SelectTrigger id="category" className="text-sm">
                <SelectValue placeholder={
                    filteredCategories.length === 0 && selectedCategoryType ?
                    `No ${selectedCategoryType.toLowerCase()} categories` :
                    "Select Category"
                } />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((cat: AdminCategoryType) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-1">
          <Label htmlFor="foodName">Food Name</Label>
          <Input id="foodName" type="text" value={foodName} onChange={(e) => setFoodName(e.target.value)} required disabled={isEditingFood} className="text-sm"/>
        </div>
        <div className="space-y-1">
          <Label htmlFor="price">Price ($)</Label>
          <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01" disabled={isEditingFood} className="text-sm"/>
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
                  placeholder={`Preset comment ${index + 1}`} disabled={isEditingFood}
                  className="text-sm"
              />
          </div>
        ))}

        <Button type="submit" className="w-full" disabled={isEditingFood || !selectedCategoryId || loadingCategories}>
          {isEditingFood ? "Saving..." : "💾 Save Changes"}
        </Button>
      </form>
    </div>
  );
}