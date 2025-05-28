// src/app/admin/waiters/edit/[id]/page.tsx
"use client";

import { EditWaiterForm } from "@/features/admin/waiters/components/EditWaiterForm";
import { useParams } from "next/navigation";

export default function EditAdminWaiterPage() {
  const params = useParams();
  const waiterId = Number(params.id);

  if (isNaN(waiterId)) {
    return <p className="text-center text-red-500">Invalid Waiter ID.</p>;
  }

  return <EditWaiterForm waiterId={waiterId} />;
}