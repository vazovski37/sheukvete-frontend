"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWaiters } from "@/hooks/useWaiters";

export default function AddWaiterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { handleAddWaiter } = useWaiters();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    await handleAddWaiter({ username, password, confirmPassword });
    router.push("/admin/waiters");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Waiter</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Label>Username</Label>
        <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />

        <Label>Password</Label>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <Label>Confirm Password</Label>
        <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

        <Button type="submit">Add Waiter</Button>
      </form>
    </div>
  );
}
