// src/features/admin/finances/components/FinanceSummaryTable.tsx
"use client";

import type { FinanceSummary } from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO, isValid } from "date-fns";

interface FinanceSummaryTableProps {
  data: FinanceSummary[];
  isLoading: boolean;
}

export function FinanceSummaryTable({ data, isLoading }: FinanceSummaryTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-base">📊 Sales Summary by Waiter</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
           <Skeleton className="h-10 w-full mb-2" /> {/* Header skeleton */}
           <Skeleton className="h-8 w-full mb-1" />
           <Skeleton className="h-8 w-full mb-1" />
           <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">📊 Sales Summary by Waiter</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Waiter Name</TableHead>
              <TableHead className="text-right whitespace-nowrap">Total Sales ($)</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead className="whitespace-nowrap">Payment Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((summary, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium whitespace-nowrap">{summary.waiterName}</TableCell>
                  <TableCell className="text-right">${summary.totalAmount.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{summary.totalOrders}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {isValid(parseISO(summary.paymentDate)) ? format(parseISO(summary.paymentDate), "PPP") : summary.paymentDate}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                  No summary data available for the selected period.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}