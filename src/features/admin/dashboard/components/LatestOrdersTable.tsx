// src/features/admin/dashboard/components/LatestOrdersTable.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { LatestOrderItem } from "../types";

interface LatestOrdersTableProps {
  orders: LatestOrderItem[];
  isLoading?: boolean;
}

export function LatestOrdersTable({ orders, isLoading }: LatestOrdersTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          {isLoading ? <Skeleton className="h-6 w-1/2" /> : "Latest Orders"}
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm">Order ID</TableHead>
              <TableHead className="text-xs sm:text-sm">Customer</TableHead>
              <TableHead className="text-xs sm:text-sm text-right">Total</TableHead>
              <TableHead className="text-xs sm:text-sm">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                </TableRow>
              ))
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-sm">{order.id}</TableCell>
                  <TableCell className="text-sm">{order.customer}</TableCell>
                  <TableCell className="text-right text-sm">${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "Completed" ? "success" : 
                        order.status === "Pending" ? "secondary" : "outline"
                      }
                      className="text-xs"
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                        No recent orders found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}