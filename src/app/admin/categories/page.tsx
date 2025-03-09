"use client";

import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Category, CategoryType } from "@/types/category";

export default function CategoriesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<CategoryType | "ALL">("ALL");
  const { categories, loading, handleDeleteCategory } = useCategories();

  // Filter categories locally
  const filteredCategories =
    filter === "ALL" ? categories : categories.filter((cat) => cat.type === (filter === "MEAL" ? "MEAL" : "DRINK"));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>

      {/* Top Actions: Add Category & Filter */}
      <div className="flex items-center justify-between mb-4">
        <Button onClick={() => router.push("/admin/categories/add")}>
          + Add New Category
        </Button>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-4">
          <Label>Filter:</Label>
          <Select value={filter} onValueChange={(value) => setFilter(value as CategoryType | "ALL")}>
            <SelectTrigger>
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="MEAL">Meals</SelectItem>
              <SelectItem value="DRINK">Drinks</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Categories Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category: Category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.type}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push(`/admin/categories/edit/${category.id}`)}>
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleDeleteCategory(category.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
