// src/features/admin/waiters/components/AddWaiterForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminWaiters } from "../hooks/useAdminWaiters";
import { toast } from "sonner";

export function AddWaiterForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { addWaiter, isAddingWaiter } = useAdminWaiters();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      await addWaiter({ username, password, confirmPassword });
      router.push("/admin/waiters");
    } catch (error) {
      // Error is already handled by the hook's onError, but you can add specific UI feedback here if needed
      console.error("Add waiter failed from component", error);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => router.push("/admin/waiters")}>
          ← Back
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold"> Add New Waiter</h1>
      </div>

      <p className="text-sm text-muted-foreground">
        Create a new waiter account for your staff.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isAddingWaiter}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isAddingWaiter}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isAddingWaiter}
          />
        </div>

        <Button type="submit" className="w-full sm:w-auto" disabled={isAddingWaiter}>
          {isAddingWaiter ? "Adding..." : "✅ Add Waiter"}
        </Button>
      </form>
    </div>
  );
}