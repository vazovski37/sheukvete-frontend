"use client";

import { useWaiters } from "@/hooks/useWaiters";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function WaitersPage() {
  const router = useRouter();
  const { waiters, loading, handleDeleteWaiter } = useWaiters();

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Waiters</h1>

      <Button className="mb-4" onClick={() => router.push("/admin/waiters/add")}>
        + Add New Waiter
      </Button>

      {loading ? <p>Loading...</p> : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {waiters.map((waiter) => (
              <TableRow key={waiter.id}>
                <TableCell>{waiter.username}</TableCell>
                <TableCell>{waiter.role}</TableCell>
                <TableCell>
                  <Button onClick={() => router.push(`/admin/waiters/edit/${waiter.id}`)}>Edit</Button>
                  <Button variant="destructive" onClick={() => handleDeleteWaiter(waiter.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
