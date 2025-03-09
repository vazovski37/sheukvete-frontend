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

  // Find the category by ID
  const category = categories.find((c) => c.id === Number(id));

  // State for the edited category
  const [categoryName, setCategoryName] = useState(category?.name || "");
  const [categoryType, setCategoryType] = useState<CategoryType>(category?.type === "MEAL" ? "MEAL" : "DRINK");

  // Update state when category is loaded
  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
      setCategoryType(category.type === "MEAL" ? "MEAL" : "DRINK");
    }
  }, [category]);

  // Handle form submission
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Category</h1>

      {category ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Name Input */}
          <div>
            <Label>Category Name</Label>
            <Input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />
          </div>

          {/* Select Category Type */}
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

          {/* Submit Button */}
          <Button type="submit">Save Changes</Button>
        </form>
      ) : (
        <p className="text-red-500">Category not found</p>
      )}
    </div>
  );
}
