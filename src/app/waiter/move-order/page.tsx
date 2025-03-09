"use client";

import { useOrdersManagement } from "@/hooks/useOrdersManagement";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function MoveOrderPage() {
  const { occupiedTables, tables, handleMoveOrder } = useOrdersManagement(); // Fetch all tables
  const [sourceTable, setSourceTable] = useState<number | null>(null);
  const [targetTable, setTargetTable] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMove = async () => {
    if (!sourceTable || !targetTable || sourceTable === targetTable) {
      toast.error("Please select two different tables.");
      return;
    }

    try {
      setLoading(true);
      await handleMoveOrder({ sourceTableId: sourceTable, targetTableId: targetTable });
      toast.success(`Order moved from Table ${sourceTable} to Table ${targetTable}!`);
      setSourceTable(null);
      setTargetTable(null);
    } catch {
      toast.error("Failed to move order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">🔄 Move Order</h1>

      <div className="space-y-6">
        {/* Select Source Table */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Source Table (Current Order)</label>
          <Select
            value={sourceTable?.toString() || ""}
            onValueChange={(val) => setSourceTable(Number(val))}
            disabled={occupiedTables.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder={occupiedTables.length > 0 ? "Select Source Table" : "No occupied tables"} />
            </SelectTrigger>
            <SelectContent>
              {occupiedTables.map((table) => (
                <SelectItem key={table.id} value={table.id.toString()}>
                  Table {table.tableNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Select Target Table */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Table (New Order Location)</label>
          <Select
            value={targetTable?.toString() || ""}
            onValueChange={(val) => setTargetTable(Number(val))}
            disabled={!sourceTable || tables.length === 0} // Disable if no source selected
          >
            <SelectTrigger>
              <SelectValue placeholder={sourceTable ? "Select Target Table" : "Select Source First"} />
            </SelectTrigger>
            <SelectContent>
              {tables
                .filter((table) => table.id !== sourceTable) // Exclude selected source table
                .map((table) => (
                  <SelectItem key={table.id} value={table.id.toString()}>
                    Table {table.tableNumber} {occupiedTables.some((t) => t.id === table.id) ? "(Occupied)" : "(Available)"}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Move Button */}
        <Button
          onClick={handleMove}
          disabled={!sourceTable || !targetTable || sourceTable === targetTable || loading}
          className="w-full"
        >
          {loading ? <Loader2 className="animate-spin size-5" /> : "Move Order"}
        </Button>
      </div>
    </div>
  );
}
