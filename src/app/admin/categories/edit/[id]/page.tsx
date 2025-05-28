"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCategories } from "@/hooks/useCategories";
import { CategoryType } from "@/types/category";

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams();
  const { categories, handleUpdateCategory } = useCategories();

  const category = categories.find((c) => c.id === Number(id));
  const [categoryName, setCategoryName] = useState(category?.name || "");
  const [categoryType, setCategoryType] = useState<CategoryType>(category?.type === "MEAL" ? "MEAL" : "DRINK");

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
      setCategoryType(category.type);
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Category name cannot be empty.");
      return;
    }

    await handleUpdateCategory(Number(id), { categoryName, categoryType });
    router.push("/admin/categories");
  };

  return (
    <div className="p-4 sm:p-6 max-w-md mx-auto space-y-6">
      <div className="flex flex-row justify-between items-center">
        <Button size="sm" variant="outline" onClick={() => router.back()}>
          ← Back
        </Button>
        <h1 className="text-lg sm:text-2xl font-bold"> Edit Category</h1>
      </div>

      {category ? (
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <Label>Category Name</Label>
            <Input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Category Type</Label>
            <Select value={categoryType} onValueChange={(value) => setCategoryType(value as CategoryType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MEAL">Meals</SelectItem>
                <SelectItem value="DRINK">Drinks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full sm:w-auto">
             Save Changes
          </Button>
        </form>
      ) : (
        <p className="text-red-500">⚠️ Category not found.</p>
      )}
    </div>
  );
}
