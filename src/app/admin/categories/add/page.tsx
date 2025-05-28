"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCategories } from "@/hooks/useCategories";

export default function AddCategoryPage() {
  const router = useRouter();
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState<"MEAL" | "DRINK">("MEAL");
  const { handleAddCategory } = useCategories();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Category name cannot be empty.");
      return;
    }

    await handleAddCategory(categoryName, categoryType);
    router.push("/admin/categories");
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-row justify-between items-center">
        <Button size="sm" variant="outline" onClick={() => router.push("/admin/categories")}>
          ← Back
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold"> Add New Category</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm sm:text-base">
        <div className="space-y-1">
          <Label>Category Name</Label>
          <Input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            placeholder="e.g. Salads, Soft Drinks..."
          />
        </div>

        <div className="space-y-1">
          <Label>Category Type</Label>
          <Select value={categoryType} onValueChange={(value) => setCategoryType(value as "MEAL" | "DRINK")}>
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
           Add Category
        </Button>
      </form>
    </div>
  );
}
