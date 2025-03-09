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

  // ✅ Call useCategories() without arguments
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Category</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input for Category Name */}
        <div>
          <Label>Category Name</Label>
          <Input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />
        </div>

        {/* Select for Category Type */}
        <div>
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

        {/* Submit Button */}
        <Button type="submit">Add Category</Button>
      </form>
    </div>
  );
}
