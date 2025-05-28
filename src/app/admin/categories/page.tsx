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

  const filteredCategories =
    filter === "ALL" ? categories : categories.filter((cat) => cat.type === filter);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-lg sm:text-2xl font-bold">📂 Categories</h1>

      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <Button className="w-full sm:w-auto" onClick={() => router.push("/admin/categories/add")}>
           Add New Category
        </Button>

        <div className="flex items-center gap-2 text-sm w-full sm:w-auto">
          <Label htmlFor="filter">Filter:</Label>
          <Select value={filter} onValueChange={(value) => setFilter(value as CategoryType | "ALL")}>
            <SelectTrigger className="w-full sm:w-40">
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

      {/* Table */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : (
        <div className="overflow-x-auto border rounded-md">
          <Table className="min-w-[500px] text-sm">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
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
                    <TableCell>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/categories/edit/${category.id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
