import { useEffect, useState } from "react";
import { fetchCategories, addCategory, deleteCategory, editCategory } from "@/services/categoryService";
import { Category, AddCategoryRequest, EditCategoryRequest, CategoryType } from "@/types/category";
import { toast } from "sonner";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetchCategories()
      .then((data: Category[]) => {
        console.log("Fetched Categories:", data);
        setCategories(data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories");
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddCategory = async (categoryName: string, categoryType: CategoryType) => {
    try {
      await addCategory({ categoryName, categoryType });

      toast.success("Category added successfully!");

      // Ensure type consistency by converting "MEALS" -> "MEAL" and "DRINKS" -> "DRINK"
      setCategories((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: categoryName,
          type: categoryType === "MEAL" ? "MEAL" : "DRINK",
        } as Category,
      ]);
    } catch {
      toast.error("Failed to add category.");
    }
  };

  const handleUpdateCategory = async (id: number, updatedCategory: EditCategoryRequest) => {
    try {
      await editCategory(id, updatedCategory);
      toast.success("Category updated successfully!");

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === id
            ? {
                id,
                name: updatedCategory.categoryName,
                type: updatedCategory.categoryType === "MEAL" ? "MEAL" : "DRINK",
              }
            : cat
        )
      );
    } catch {
      toast.error("Failed to update category.");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully!");
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch {
      toast.error("Failed to delete category.");
    }
  };

  return { categories, loading, handleAddCategory, handleUpdateCategory, handleDeleteCategory };
}
