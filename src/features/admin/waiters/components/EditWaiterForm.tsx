// src/features/admin/waiters/components/EditWaiterForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminWaiters } from "../hooks/useAdminWaiters";
import type { Waiter } from "../types"; // Ensure Waiter type is imported
import { Skeleton } from "@/components/ui/skeleton";

interface EditWaiterFormProps {
  waiterId: number;
}

export function EditWaiterForm({ waiterId }: EditWaiterFormProps) {
  const router = useRouter();
  const { waiters, editWaiter, isEditingWaiter, loadingWaiters } = useAdminWaiters();

  const [username, setUsername] = useState("");
  const [initialWaiter, setInitialWaiter] = useState<Waiter | undefined>(undefined);

  useEffect(() => {
    if (!loadingWaiters && waiters.length > 0) {
      const foundWaiter = waiters.find((w) => w.id === waiterId);
      if (foundWaiter) {
        setUsername(foundWaiter.username);
        setInitialWaiter(foundWaiter);
      }
    }
  }, [waiterId, waiters, loadingWaiters]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await editWaiter({ id: waiterId, data: { username } });
      router.push("/admin/waiters");
    } catch (error) {
      console.error("Edit waiter failed from component", error);
    }
  };

  if (loadingWaiters && !initialWaiter) {
    return (
      <div className="p-4 sm:p-6 max-w-md mx-auto space-y-6">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-24" />
      </div>
    );
  }

  if (!initialWaiter) {
    return <p className="p-4 sm:p-6 text-center text-red-500">⚠️ Waiter not found or an error occurred.</p>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => router.push("/admin/waiters")}>
          ← Back
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold"> Edit Waiter</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isEditingWaiter}
          />
        </div>
        {/* Add fields for password change here if needed in the future */}
        <Button type="submit" className="w-full sm:w-auto" disabled={isEditingWaiter}>
          {isEditingWaiter ? "Saving..." : "💾 Save Changes"}
        </Button>
      </form>
    </div>
  );
}