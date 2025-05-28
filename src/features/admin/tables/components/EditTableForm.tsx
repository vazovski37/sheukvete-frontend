// src/features/admin/tables/components/EditTableForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminTables } from "../hooks/useAdminTables";
import type { Table as TableType } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface EditTableFormProps {
  tableId: number;
}

export function EditTableForm({ tableId }: EditTableFormProps) {
  const router = useRouter();
  const { tables, editTable, isEditingTable, loadingTables } = useAdminTables();

  const [tableNumber, setTableNumber] = useState("");
  const [initialTable, setInitialTable] = useState<TableType | undefined>(undefined);

  useEffect(() => {
    if (!loadingTables && tables.length > 0) {
      const foundTable = tables.find((t) => t.id === tableId);
      if (foundTable) {
        setTableNumber(foundTable.tableNumber.toString());
        setInitialTable(foundTable);
      }
    }
  }, [tableId, tables, loadingTables]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(tableNumber);
    if (isNaN(num) || num <= 0) {
      toast.error("Please enter a valid table number.");
      return;
    }
    try {
      await editTable({ id: tableId, data: { tableNumber: num } });
      router.push("/admin/tables");
    } catch (error) {
      // Error handled by hook
    }
  };

  if (loadingTables && !initialTable) {
    return (
      <div className="p-4 sm:p-6 max-w-md mx-auto space-y-6">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-24" />
      </div>
    );
  }

  if (!initialTable && !loadingTables) {
    return <p className="p-4 sm:p-6 text-center text-red-500">⚠️ Table not found.</p>;
  }

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
        <h1 className="text-lg sm:text-xl font-bold">Edit Table</h1>
      </div>

      {initialTable && (
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
              disabled={isEditingTable}
            />
          </div>

          <Button type="submit" className="w-full sm:w-auto" disabled={isEditingTable}>
            {isEditingTable ? "Saving..." : "💾 Save Changes"}
          </Button>
        </form>
      )}
    </div>
  );
}