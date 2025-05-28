// src/features/admin/tables/components/AddTableForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminTables } from "../hooks/useAdminTables";
import { toast } from "sonner";

export function AddTableForm() {
  const router = useRouter();
  const [tableNumber, setTableNumber] = useState("");
  const { addTable, isAddingTable } = useAdminTables();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(tableNumber);
    if (isNaN(num) || num <= 0) {
      toast.error("Please enter a valid table number.");
      return;
    }
    try {
      await addTable({ tableNumber: num });
      router.push("/admin/tables");
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-md mx-auto space-y-6">
      <div className="flex justify-between items-center gap-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push("/admin/tables")}
        >
          ← Back
        </Button>
        <h1 className="text-lg sm:text-xl font-bold">Add New Table</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tableNumber">Table Number</Label>
          <Input
            id="tableNumber"
            type="number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            required
            min="1"
            className="text-sm"
            disabled={isAddingTable}
          />
        </div>

        <Button type="submit" className="w-full sm:w-auto" disabled={isAddingTable}>
          {isAddingTable ? "Adding..." : "✨ Add Table"}
        </Button>
      </form>
    </div>
  );
}