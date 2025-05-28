"use client";

import { useWaiters } from "@/hooks/useWaiters";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function WaitersPage() {
  const router = useRouter();
  const { waiters, loading, handleDeleteWaiter } = useWaiters();

  return (
    <div className="p-4 sm:p-6 space-y-4 w-full">
      <div className="flex flex-row sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">👨‍🍳 Waiters</h1>
        <Button size="sm" onClick={() => router.push("/admin/waiters/add")}>
          + Add New Waiter
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">Username</TableHead>
                <TableHead className="text-xs sm:text-sm">Role</TableHead>
                <TableHead className="text-xs sm:text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waiters.map((waiter) => (
                <TableRow key={waiter.id}>
                  <TableCell className="text-sm">{waiter.username}</TableCell>
                  <TableCell className="text-sm">{waiter.role}</TableCell>
                  <TableCell className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/waiters/edit/${waiter.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteWaiter(waiter.id)}
                    >
                      Delete
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
