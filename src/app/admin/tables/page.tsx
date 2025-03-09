"use client";

import { useTables } from "@/hooks/useTables";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function TablesPage() {
  const router = useRouter();
  const { tables, loading, handleDeleteTable } = useTables();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tables</h1>

      <Button className="mb-4" onClick={() => router.push("/admin/tables/add")}>
        + Add New Table
      </Button>

      {loading ? <p>Loading...</p> : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Table Number</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tables.map((table) => (
              <TableRow key={table.id}>
                <TableCell>{table.tableNumber}</TableCell>
                <TableCell>
                  <Button onClick={() => router.push(`/admin/tables/edit/${table.id}`)}>Edit</Button>
                  <Button variant="destructive" onClick={() => handleDeleteTable(table.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
