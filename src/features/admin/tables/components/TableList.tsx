// src/features/admin/tables/components/TableList.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminTables } from "../hooks/useAdminTables";
import type { Table as TableType } from "../types"; // Renamed to avoid conflict
import { Skeleton } from "@/components/ui/skeleton";

export function TableList() {
  const router = useRouter();
  const {
    tables,
    loadingTables,
    deleteTable,
    isDeletingTable,
  } = useAdminTables();

  const handleDelete = async (id: number) => {
    // Optional: Add confirmation dialog
    await deleteTable(id);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold">🍽️ Tables</h1>
        <Button size="sm" onClick={() => router.push("/admin/tables/add")}>
          + Add New Table
        </Button>
      </div>

      {loadingTables ? (
        <div className="overflow-x-auto rounded border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table Number</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell className="flex flex-wrap gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : tables.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No tables found.</p>
      ) : (
        <div className="overflow-x-auto rounded border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table Number</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tables.map((table: TableType) => (
                <TableRow key={table.id}>
                  <TableCell className="text-sm">{table.tableNumber}</TableCell>
                  <TableCell className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/admin/tables/edit/${table.id}`)}
                      disabled={isDeletingTable}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(table.id)}
                      disabled={isDeletingTable}
                    >
                      {isDeletingTable ? "Deleting..." : "Delete"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}