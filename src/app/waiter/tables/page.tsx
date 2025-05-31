"use client";

import { useOrdersManagement } from "@/features/waiter/hooks/useWaiterOrderManagement";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";

export default function TablesPage() {
  const { tables, occupiedTables, loading } = useOrdersManagement();
  const router = useRouter();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tables</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Table Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tables.map((table) => (
              <TableRow key={table.id}>
                <TableCell>{table.tableNumber}</TableCell>
                <TableCell>{occupiedTables.some((t) => t.id === table.id) ? "Occupied" : "Available"}</TableCell>
                <TableCell>
                  <Button onClick={() => router.push(`/waiter/orders/${table.id}`)}>View Order</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
