"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchWaiterOrders } from "@/services/waiterService";
import { WaiterOrder } from "@/types/order";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function OrderHistoryPage() {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["waiter", "order-history"],
    queryFn: fetchWaiterOrders,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin size-6" />
      </div>
    );
  }

  const orders = data?.orders ?? [];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => router.push("/waiter")}
      >
        ← Back
      </Button>
      <h1 className="text-xl sm:text-2xl font-bold">🧾 Order History</h1>
      </div>

      {orders.map((order) => {
        const paidItems = order.items.filter((item) => item.paidForWaiter);
        const unpaidItems = order.items.filter((item) => !item.paidForWaiter);

        const paidTotal = paidItems.reduce(
          (sum, item) => sum + item.food.price * item.quantity,
          0
        );
        const unpaidTotal = unpaidItems.reduce(
          (sum, item) => sum + item.food.price * item.quantity,
          0
        );

        return (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">
                Order #{order.id} – Table {order.table.tableNumber}
                <span className="block text-xs text-muted-foreground">
                  {format(new Date(order.orderTime), "PPpp")}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.food.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${(item.food.price * item.quantity).toFixed(2)}</TableCell>
                      <TableCell>{item.comment || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={item.paidForWaiter ? "default" : "secondary"}>
                          {item.paidForWaiter ? "Paid" : "Unpaid"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="text-sm mt-4 space-y-1">
                <p>✅ Paid: ${paidTotal.toFixed(2)}</p>
                <p>🕓 Unpaid: ${unpaidTotal.toFixed(2)}</p>
                <p>🧾 API Total: ${order.totalPrice.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
