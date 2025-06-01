// src/features/waiter/components/OrderHistoryDisplay.tsx
"use client";

import { useRouter } from "next/navigation";
import { useWaiterOrderHistory } from "../hooks/useWaiterOrderHistory";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

export function OrderHistoryDisplay() {
  const router = useRouter();
  const { orderHistory, isLoadingHistory, isErrorHistory } = useWaiterOrderHistory();

  if (isLoadingHistory) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (isErrorHistory) {
    return (
      <div className="p-4 sm:p-6 text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-destructive mb-2" />
        <p className="font-semibold">Error Loading Order History</p>
        <p className="text-sm text-muted-foreground">Could not fetch order history details.</p>
        <Button onClick={() => router.push("/waiter")} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => router.push("/waiter")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back 
        </Button>
        <h1 className="text-xl sm:text-2xl font-semibold">Order History</h1>
      </div>

      {orderHistory.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No past orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orderHistory.map(order => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-md">Order #{order.id} - Table {order.table.tableNumber}</CardTitle>
                        <CardDescription>
                            {isValid(parseISO(order.orderTime)) ? format(parseISO(order.orderTime), "PPpp") : "Invalid Date"} by {order.waiter.username}
                        </CardDescription>
                    </div>
                    <Badge variant={order.paid ? "success" : "destructive"}>{order.paid ? "Fully Paid" : "Partially/Unpaid"}</Badge>
                </div>
              </CardHeader>
              <CardContent className="max-h-60 overflow-y-auto"> {/* Scrollable items */}
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.food.name} {item.comment && <span className="text-muted-foreground text-[0.7rem]">({item.comment})</span>}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">${(item.food.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell>
                            <Badge variant={item.paidForWaiter ? "success" : "outline"} className="text-[0.65rem] px-1.5 py-0.5">
                                {item.paidForWaiter ? "Paid" : "Unpaid"}
                            </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="text-sm font-semibold border-t pt-3 mt-2 flex justify-end">
                Total: ${order.totalPrice?.toFixed(2) || order.totalAmount || 'N/A'}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}