// src/app/admin/tables/edit/[id]/page.tsx
"use client";

import { EditTableForm } from "@/features/admin/tables/components/EditTableForm";
import { useParams } from "next/navigation";

export default function EditAdminTablePage() {
  const params = useParams();
  const tableId = Number(params.id);

  if (isNaN(tableId)) {
    // Or redirect to a 404 page or the tables list
    return <p className="text-center text-red-500">Invalid Table ID.</p>;
  }

  return <EditTableForm tableId={tableId} />;
}