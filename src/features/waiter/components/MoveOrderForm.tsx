// src/features/waiter/components/MoveOrderForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWaiterOrderManagement } from "../hooks/useWaiterOrderManagement";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Truck } from "lucide-react";
import type { WaiterTableInfo } from "../types";

export function MoveOrderForm() {
  const router = useRouter();
  const { 
    tables, occupiedTables, 
    moveOrder, isMovingOrder, 
    isLoadingTables, isLoadingOccupiedTables 
  } = useWaiterOrderManagement();
  
  const [sourceTableId, setSourceTableId] = useState<string>("");
  const [targetTableId, setTargetTableId] = useState<string>("");

  const handleMove = async () => {
    if (!sourceTableId || !targetTableId) {
      toast.error("Please select both source and target tables.");
      return;
    }
    if (sourceTableId === targetTableId) {
      toast.error("Source and target tables cannot be the same.");
      return;
    }
    await moveOrder({ sourceTableId: Number(sourceTableId), targetTableId: Number(targetTableId) }, {
        onSuccess: () => {
            toast.success(`Order moved successfully!`);
            setSourceTableId("");
            setTargetTableId("");
            // Query invalidation is handled by the hook
        },
        onError: (err) => {
            toast.error(`Failed to move order: ${err.message}`);
        }
    });
  };
  
  const isLoading = isLoadingTables || isLoadingOccupiedTables;

  return (
    <div className="p-4 sm:p-6 max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => router.push("/waiter")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Dashboard
        </Button>
        <h1 className="text-xl sm:text-2xl font-semibold">Move Order</h1>
        <div className="w-24"></div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Tables</CardTitle>
          <CardDescription>Move an active order from one table to another.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="sourceTable" className="block text-sm font-medium mb-1 text-muted-foreground">From Table (must be occupied)</label>
            <Select
              value={sourceTableId}
              onValueChange={setSourceTableId}
              disabled={isLoading || occupiedTables.length === 0}
            >
              <SelectTrigger id="sourceTable">
                <SelectValue placeholder={isLoading ? "Loading..." : (occupiedTables.length > 0 ? "Select source table" : "No occupied tables")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Occupied Tables</SelectLabel>
                  {occupiedTables.map((table: WaiterTableInfo) => (
                    <SelectItem key={table.id} value={String(table.id)}>
                      Table {table.tableNumber}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="targetTable" className="block text-sm font-medium mb-1 text-muted-foreground">To Table (preferably available)</label>
            <Select
              value={targetTableId}
              onValueChange={setTargetTableId}
              disabled={isLoading || tables.length === 0 || !sourceTableId}
            >
              <SelectTrigger id="targetTable">
                <SelectValue placeholder={isLoading ? "Loading..." : (tables.length > 0 ? "Select target table" : "No tables available")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                   <SelectLabel>All Tables</SelectLabel>
                  {tables
                    .filter(table => String(table.id) !== sourceTableId) // Exclude source table
                    .map((table: WaiterTableInfo) => (
                      <SelectItem key={table.id} value={String(table.id)}>
                        Table {table.tableNumber} {!occupiedTables.some(ot => ot.id === table.id) ? "(Available)" : "(Occupied - Careful!)"}
                      </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

           <Button
            onClick={handleMove}
            disabled={!sourceTableId || !targetTableId || isMovingOrder || isLoading}
            className="w-full mt-2"
            size="lg"
          >
            {isMovingOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Truck className="mr-2 h-4 w-4" />}
            Confirm Move
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}