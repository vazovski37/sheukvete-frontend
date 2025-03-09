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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Waiter</h1>

      {waiter ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Label>Username</Label>
          <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />

          <Button type="submit">Save Changes</Button>
        </form>
      ) : (
        <p className="text-red-500">Waiter not found</p>
      )}
    </div>
  );
}
