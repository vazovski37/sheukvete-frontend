// src/app/admin/categories/edit/[id]/page.tsx
"use client";

import { EditCategoryForm } from "@/features/admin/categories/components/EditCategoryForm";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditAdminCategoryPage() {
  const params = useParams();
  const categoryIdString = params.id; // id can be string or string[]

  if (!categoryIdString) {
    return ( // Basic loading state for ID
        <div className="p-4 sm:p-6 max-w-md mx-auto space-y-6">
             <Skeleton className="h-8 w-20" /> <Skeleton className="h-10 w-full" />
        </div>
    );
  }

  const categoryId = Number(Array.isArray(categoryIdString) ? categoryIdString[0] : categoryIdString);

  if (isNaN(categoryId)) {
    return <p className="text-center text-red-500 py-10">Invalid Category ID.</p>;
  }

  return <EditCategoryForm categoryId={categoryId} />;
}