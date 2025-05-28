"use client";

import { useOrdersManagement } from "@/hooks/useOrdersManagement";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function OrderPage() {
  const { tableId } = useParams();
  const router = useRouter();
  const { order, loadOrder, loading } = useOrdersManagement();

  useEffect(() => {
    if (tableId) {
      loadOrder(Number(tableId));
    }
  }, [tableId]);

  const totalAmount = order?.items?.reduce(
    (sum, item) => sum + item.food.price * item.quantity,
    0
  ) ?? 0;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => router.push("/waiter")}
      >
        ← Back
      </Button>
        <h1 className="text-xl sm:text-2xl font-semibold">🧾 Order – Table {tableId}</h1>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin size-8 text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Ordered Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order?.items?.length ? (
                <>
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="border rounded-md p-3 flex flex-col gap-1 bg-background"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.food.name}</span>
                        <span className="text-sm text-muted-foreground">
                          ${item.food.price.toFixed(2)} × {item.quantity}
                        </span>
                      </div>
                      {item.comment && (
                        <p className="text-xs italic text-muted-foreground">“{item.comment}”</p>
                      )}
                    </div>
                  ))}

                  {/* Total */}
                  <div className="pt-2 border-t text-sm text-right text-muted-foreground">
                    <span>Total: </span>
                    <span className="font-medium text-foreground">${totalAmount.toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No items in this order yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Pay Button */}
          <Button
            size="lg"
            variant="destructive"
            className="w-full sm:w-auto"
            onClick={() => router.push(`/waiter/pay/${tableId}`)}
            disabled={!order?.items?.length}
          >
            ✅ Pay & Close
          </Button>
        </>
      )}
    </div>
  );
}
