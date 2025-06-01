// src/features/waiter/components/OrderViewer.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWaiterOrderByTableId } from "../api";
import type { WaiterDisplayOrder } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowLeft, CreditCard, Edit3, Loader2 } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";

export function OrderViewer() {
  const router = useRouter();
  const params = useParams();
  const tableId = Number(params.tableId);

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useQuery<WaiterDisplayOrder | null, Error>({
    queryKey: ["waiter", "order", tableId],
    queryFn: () => (tableId && !isNaN(tableId) ? fetchWaiterOrderByTableId(tableId) : Promise.resolve(null)),
    enabled: !!tableId && !isNaN(tableId),
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  const totalAmount = useMemo(() => {
    if (!order || !Array.isArray(order.items)) return 0;
    return order.items.reduce((sum, item) => {
      const price = item?.food?.price;
      const quantity = item?.quantity;
      if (typeof price === 'number' && typeof quantity === 'number') {
        return sum + price * quantity;
      }
      return sum;
    }, 0);
  }, [order]);

  if (!tableId || isNaN(tableId)) {
    return (
      <div className="p-4 sm:p-6 text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-destructive mb-2" />
        <p className="font-semibold">Invalid Table ID</p>
        <p className="text-sm text-muted-foreground">Please go back and select a valid table.</p>
        <Button onClick={() => router.push("/waiter")} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-6 text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-destructive mb-2" />
        <p className="font-semibold">Error Loading Order</p>
        <p className="text-sm text-muted-foreground">{error?.message || "Could not fetch order details."}</p>
        <Button onClick={() => router.push("/waiter")} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => router.push("/waiter")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
        </div>
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
            <CardTitle>Order for Table {tableId}</CardTitle>
            <CardDescription>No active order found for this table.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => router.push(`/waiter/orders/update/${tableId}`)}>
                    <Edit3 className="mr-2 h-4 w-4" /> Create New Order
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  const tableNumberDisplay = order.table?.tableNumber ?? tableId;
  // Accessing "additionall procentage" safely, assuming it might be misspelled in the response.
  const additionalPercentageString = order["additionall procentage" as keyof WaiterDisplayOrder] || order["additionalPercentage" as keyof WaiterDisplayOrder] || "0";
  const additionalPercentageValue = parseFloat(additionalPercentageString as string || "0");
  const additionalAmount = (totalAmount * additionalPercentageValue) / 100;
  const grandTotal = totalAmount + additionalAmount;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => router.push("/waiter")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <h1 className="text-xl sm:text-2xl font-semibold text-center">
          Order Details - Table {tableNumberDisplay}
        </h1>
        <div className="w-24 hidden sm:block"> {/* Spacer, hidden on small screens */} </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">Order ID: #{order.id}</CardTitle>
              <CardDescription>
                Placed by: {order.waiter?.username || 'N/A'} on{" "}
                {typeof order.orderTime === 'string' && isValid(parseISO(order.orderTime))
                  ? format(parseISO(order.orderTime), "PPpp")
                  : "Invalid Date"}
              </CardDescription>
            </div>
            <Badge variant={order.paid ? "success" : "secondary"}>
              {order.paid ? "Paid" : "Pending Payment"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.isArray(order.items) && order.items.length > 0 ? (
            order.items.map((item, index) => ( // Added index for the key
              <div
                // MODIFIED KEY: Using a composite key as item.id is missing from backend item lines
                key={`order-item-${item.food?.id || 'unknown-food'}-${item.comment || 'no-comment'}-${index}`}
                className="flex items-start justify-between gap-3 p-3 border rounded-md bg-muted/20"
              >
                <div className="flex-grow">
                  <p className="font-medium text-sm">{item.food?.name || 'Unknown Food'}</p>
                  <p className="text-xs text-muted-foreground">
                    Category: {item.food?.category?.name || 'N/A'}
                  </p>
                  {item.comment && (
                    <p className="text-xs italic text-blue-600 dark:text-blue-400">
                      "{item.comment}"
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm">
                    {item.quantity || 0} x ${(item.food?.price || 0).toFixed(2)}
                  </p>
                  <p className="text-sm font-semibold">
                    ${((item.quantity || 0) * (item.food?.price || 0)).toFixed(2)}
                  </p>
                  {item.paidForWaiter && <Badge variant="success" className="mt-1 text-xs">Paid</Badge>}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No items in this order.</p>
          )}
        </CardContent>
        {Array.isArray(order.items) && order.items.length > 0 && (
          <CardFooter className="flex flex-col items-end gap-1 pt-4 border-t">
            <p className="text-sm">
              Subtotal: <span className="font-medium">${totalAmount.toFixed(2)}</span>
            </p>
            {additionalPercentageValue > 0 && (
                <p className="text-xs text-muted-foreground">
                    Service ({additionalPercentageValue}%): ${additionalAmount.toFixed(2)}
                </p>
            )}
            <p className="text-lg font-bold text-primary">
              Total: ${grandTotal.toFixed(2)}
            </p>
          </CardFooter>
        )}
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        {!order.paid && (
          <Button
            size="lg"
            variant="default"
            onClick={() => router.push(`/waiter/pay/${tableId}`)}
            disabled={!Array.isArray(order.items) || order.items.length === 0}
          >
            <CreditCard className="mr-2 h-5 w-5" /> Proceed to Payment
          </Button>
        )}
        <Button
          size="lg"
          variant="outline"
          onClick={() => router.push(`/waiter/orders/update/${tableId}`)}
        >
          <Edit3 className="mr-2 h-5 w-5" /> {Array.isArray(order.items) && order.items?.length > 0 ? "Modify Order" : "Create Order"}
        </Button>
      </div>
    </div>
  );
}