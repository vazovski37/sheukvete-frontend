// src/features/admin/finances/components/FoodSalesTable.tsx
"use client";

import type { FoodSale } from "../types";
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

interface FoodSalesTableProps {
  data: FoodSale[];
  isLoading: boolean;
}

export function FoodSalesTable({ data, isLoading }: FoodSalesTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-base">🍲 Food Sales Report</CardTitle></CardHeader>
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
        <CardTitle className="text-base">🍲 Food Sales Report</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Food Name</TableHead>
              <TableHead className="whitespace-nowrap">Category</TableHead>
              <TableHead className="text-right whitespace-nowrap">Quantity Sold</TableHead>
              <TableHead className="text-right whitespace-nowrap">Revenue ($)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((sale, index) => (
                <TableRow key={`${sale.foodId}-${sale.comment || 'no-comment'}-${index}`}>
                  <TableCell className="font-medium whitespace-nowrap">{sale.foodName}</TableCell>
                  <TableCell className="whitespace-nowrap">{sale.categoryName}</TableCell>
                  <TableCell className="text-right">{sale.totalQuantity}</TableCell>
                  <TableCell className="text-right">${sale.totalRevenue.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                  No food sales data available for the selected period.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}