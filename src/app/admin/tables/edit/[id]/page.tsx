"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTables } from "@/hooks/useTables";

export default function EditTablePage() {
  const router = useRouter();
  const { id } = useParams();
  const { tables, handleEditTable } = useTables();

  const table = tables.find((t) => t.id === Number(id));
  const [tableNumber, setTableNumber] = useState(table?.tableNumber.toString() || "");

  useEffect(() => {
    if (table) setTableNumber(table.tableNumber.toString());
  }, [table]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleEditTable(Number(id), { tableNumber: parseInt(tableNumber) });
    router.push("/admin/tables");
  };

  return (
    <div className="p-4 sm:p-6 max-w-md mx-auto space-y-6">
      <div className="flex justify-between gap-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push("/admin/tables")}
        >
          ← back
        </Button>
        <h1 className="text-lg sm:text-xl font-bold">Edit Table</h1>
      </div>

      {table ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tableNumber">Table Number</Label>
            <Input
              id="tableNumber"
              type="number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              required
              className="text-sm"
            />
          </div>

          <Button type="submit" className="w-full sm:w-auto">
             Save Changes
          </Button>
        </form>
      ) : (
        <p className="text-sm text-red-500">Table not found</p>
      )}
    </div>
  );
}
