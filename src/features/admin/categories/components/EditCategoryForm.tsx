// src/features/admin/categories/components/EditCategoryForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminCategories } from "../hooks/useAdminCategories";
import type { Category, CategoryType, EditCategoryRequest } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface EditCategoryFormProps {
  categoryId: number;
}

export function EditCategoryForm({ categoryId }: EditCategoryFormProps) {
  const router = useRouter();
  const { categories, updateCategory, isUpdatingCategory, loadingCategories } = useAdminCategories();

  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState<CategoryType>("MEAL");
  const [initialCategory, setInitialCategory] = useState<Category | undefined>(undefined);

  useEffect(() => {
    if (!loadingCategories && categories.length > 0) {
      const foundCategory = categories.find((c) => c.id === categoryId);
      if (foundCategory) {
        setInitialCategory(foundCategory);
        setCategoryName(foundCategory.name);
        setCategoryType(foundCategory.type);
      }
    }
  }, [categoryId, categories, loadingCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error("Category name cannot be empty.");
      return;
    }
    const categoryData: EditCategoryRequest = { categoryName, categoryType };
    try {
      await updateCategory({ id: categoryId, data: categoryData });
      router.push("/admin/categories");
    } catch (error) {
      // Error handled by hook
    }
  };

  if (loadingCategories && !initialCategory) {
     return (
        <div className="p-4 sm:p-6 max-w-md mx-auto space-y-6">
            <div className="flex justify-between items-center"><Skeleton className="h-8 w-20" /><Skeleton className="h-8 w-32" /></div>
            <div className="space-y-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-24 mt-2" />
            </div>
        </div>
    );
  }

  if (!initialCategory && !loadingCategories) {
    return <p className="text-center text-red-500 py-10">Category not found.</p>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-md mx-auto space-y-6">
       <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => router.push("/admin/categories")}>
          ← Back
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold"> ✏️ Edit Category</h1>
      </div>
      {initialCategory && (
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="space-y-1">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName" type="text" value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required disabled={isUpdatingCategory} className="text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="categoryType">Category Type</Label>
            <Select
              value={categoryType}
              onValueChange={(value) => setCategoryType(value as CategoryType)}
              disabled={isUpdatingCategory}
            >
              <SelectTrigger id="categoryType" className="text-sm">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MEAL">Meal</SelectItem>
                <SelectItem value="DRINK">Drink</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full sm:w-auto" disabled={isUpdatingCategory}>
            {isUpdatingCategory ? "Saving..." : "💾 Save Changes"}
          </Button>
        </form>
      )}
    </div>
  );
}