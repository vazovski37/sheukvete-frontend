// src/app/admin/foods/edit/[id]/page.tsx
"use client";

import { EditFoodForm } from "@/features/admin/foods/components/EditFoodForm";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton"; // For loading the ID

export default function EditAdminFoodPage() {
  const params = useParams();
  const foodIdString = params.id; // id can be string or string[]

  if (!foodIdString) {
    // Handle case where id is not available yet during ISR or initial render
    return (
        <div className="p-4 sm:p-6 max-w-lg mx-auto space-y-6">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    );
  }

  const foodId = Number(Array.isArray(foodIdString) ? foodIdString[0] : foodIdString);

  if (isNaN(foodId)) {
    return <p className="text-center text-red-500 py-10">Invalid Food ID.</p>;
  }

  return <EditFoodForm foodId={foodId} />;
}