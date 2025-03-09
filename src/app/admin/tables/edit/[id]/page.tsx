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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Table</h1>

      {table ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Label>Table Number</Label>
          <Input type="number" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} required />

          <Button type="submit">Save Changes</Button>
        </form>
      ) : (
        <p className="text-red-500">Table not found</p>
      )}
    </div>
  );
}
