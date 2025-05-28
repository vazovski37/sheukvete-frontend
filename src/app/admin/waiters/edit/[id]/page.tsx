"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWaiters } from "@/hooks/useWaiters";

export default function EditWaiterPage() {
  const router = useRouter();
  const { id } = useParams();
  const { waiters, handleEditWaiter } = useWaiters();

  const waiter = waiters.find((w) => w.id === Number(id));
  const [username, setUsername] = useState(waiter?.username || "");

  useEffect(() => {
    if (waiter) setUsername(waiter.username);
  }, [waiter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleEditWaiter(Number(id), { username });
    router.push("/admin/waiters");
  };

  return (
    <div className="p-4 sm:p-6 max-w-md mx-auto space-y-6">
      {/* Top Header Section */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => router.push("/admin/waiters")}>
          ← Back
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold"> Edit Waiter</h1>
      </div>

      {/* Content */}
      {waiter ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full sm:w-auto">
             Save Changes
          </Button>
        </form>
      ) : (
        <p className="text-sm text-red-500">⚠️ Waiter not found</p>
      )}
    </div>
  );
}
