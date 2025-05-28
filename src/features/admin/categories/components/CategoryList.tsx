// src/features/admin/categories/components/CategoryList.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAdminCategories } from "../hooks/useAdminCategories";
import type { Category, CategoryType } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export function CategoryList() {
  const router = useRouter();
  const {
    categories,
    loadingCategories,
    deleteCategory,
    isDeletingCategory,
  } = useAdminCategories();
  const [filter, setFilter] = useState<CategoryType | "ALL">("ALL");

  const filteredCategories =
    filter === "ALL" ? categories : categories.filter((cat) => cat.type === filter);

  const handleDelete = async (categoryId: number, categoryName: string) => {
    if (window.confirm(`Are you sure you want to delete category "${categoryName}"?`)) {
      try {
        await deleteCategory(categoryId);
      } catch (error) {
        // Error handled by hook
      }
    }
  };

  const handleEdit = (categoryId: number) => {
    router.push(`/admin/categories/edit/${categoryId}`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-lg sm:text-2xl font-bold">📂 Categories</h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <Button
          className="w-full sm:w-auto"
          onClick={() => router.push("/admin/categories/add")}
          disabled={loadingCategories}
        >
          + Add New Category
        </Button>

        <div className="flex items-center gap-2 text-sm w-full sm:w-auto">
          <Label htmlFor="filter" className="whitespace-nowrap">Filter by Type:</Label>
          <Select value={filter} onValueChange={(value) => setFilter(value as CategoryType | "ALL")}>
            <SelectTrigger className="w-full sm:w-40 text-sm">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="MEAL">Meals</SelectItem>
              <SelectItem value="DRINK">Drinks</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loadingCategories ? (
        <div className="overflow-x-auto border rounded-md">
          <Table className="min-w-[500px] text-sm">
            <TableHeader>
              <TableRow>
                <TableHead><Skeleton className="h-5 w-10" /></TableHead>
                <TableHead><Skeleton className="h-5 w-32" /></TableHead>
                <TableHead><Skeleton className="h-5 w-20" /></TableHead>
                <TableHead><Skeleton className="h-5 w-24" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell className="flex gap-2"><Skeleton className="h-8 w-16" /> <Skeleton className="h-8 w-16" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : filteredCategories.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          {categories.length === 0 ? "No categories found. Please add one." : "No categories match the current filter."}
        </p>
      ) : (
        <div className="overflow-x-auto border rounded-md">
          <Table className="min-w-[500px] text-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-[120px]">Type</TableHead>
                <TableHead className="text-right w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category: Category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.type}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleEdit(category.id)}
                        disabled={isDeletingCategory}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleDelete(category.id, category.name)}
                        disabled={isDeletingCategory}
                      >
                        {isDeletingCategory ? "..." : "Delete"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}