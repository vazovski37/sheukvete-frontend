"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTables } from "@/hooks/useTables";

export default function AddTablePage() {
  const router = useRouter();
  const [tableNumber, setTableNumber] = useState("");
  const { handleAddTable } = useTables();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAddTable({ tableNumber: parseInt(tableNumber) });
    router.push("/admin/tables");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Table</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Label>Table Number</Label>
        <Input type="number" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} required />

        <Button type="submit">Add Table</Button>
      </form>
    </div>
  );
}
