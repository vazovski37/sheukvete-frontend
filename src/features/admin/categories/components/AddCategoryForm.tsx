// src/features/admin/categories/components/AddCategoryForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminCategories } from "../hooks/useAdminCategories";
import type { CategoryType } from "../types";
import { toast } from "sonner";

export function AddCategoryForm() {
  const router = useRouter();
  const { addCategory, isAddingCategory } = useAdminCategories();
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState<CategoryType>("MEAL");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error("Category name cannot be empty.");
      return;
    }
    try {
      await addCategory({ categoryName, categoryType });
      router.push("/admin/categories");
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => router.push("/admin/categories")}>
          ← Back
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold"> ✨ Add New Category</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div className="space-y-1">
          <Label htmlFor="categoryName">Category Name</Label>
          <Input
            id="categoryName"
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            placeholder="e.g. Salads, Soft Drinks..."
            disabled={isAddingCategory}
            className="text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="categoryType">Category Type</Label>
          <Select
            value={categoryType}
            onValueChange={(value) => setCategoryType(value as CategoryType)}
            disabled={isAddingCategory}
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
        <Button type="submit" className="w-full sm:w-auto" disabled={isAddingCategory}>
          {isAddingCategory ? "Adding..." : "✅ Add Category"}
        </Button>
      </form>
    </div>
  );
}