// src/features/admin/waiters/components/WaiterList.tsx
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
import { useAdminWaiters } from "../hooks/useAdminWaiters";
import type { Waiter } from "../types";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

export function WaiterList() {
  const router = useRouter();
  const {
    waiters,
    loadingWaiters,
    deleteWaiter,
    isDeletingWaiter,
  } = useAdminWaiters();

  const handleDelete = async (id: number) => {
    // Consider adding a confirmation dialog here before deleting
    await deleteWaiter(id);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-row sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">👨‍🍳 Waiters</h1>
        <Button size="sm" onClick={() => router.push("/admin/waiters/add")}>
          + Add New Waiter
        </Button>
      </div>

      {loadingWaiters ? (
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
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell className="flex flex-col sm:flex-row gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : waiters.length === 0 ? (
         <p className="text-sm text-muted-foreground text-center py-4">No waiters found.</p>
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
              {waiters.map((waiter: Waiter) => (
                <TableRow key={waiter.id}>
                  <TableCell className="text-sm">{waiter.username}</TableCell>
                  <TableCell className="text-sm">{waiter.role}</TableCell>
                  <TableCell className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/waiters/edit/${waiter.id}`)}
                      disabled={isDeletingWaiter}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(waiter.id)}
                      disabled={isDeletingWaiter}
                    >
                      {isDeletingWaiter ? "Deleting..." : "Delete"}
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