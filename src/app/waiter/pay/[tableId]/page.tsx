"use client";

import { useOrdersManagement } from "@/hooks/useOrdersManagement";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import { OrderItem } from "@/types/order";
import { PartialPaymentRequest } from "@/types/waiter";

export default function PayOrderPage() {
  const { tableId } = useParams();
  const router = useRouter();
  const { order, loadOrder, handlepayFullOrder, handlepayPartialOrder } = useOrdersManagement();

  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [additionalPercentage, setAdditionalPercentage] = useState(0);

  useEffect(() => {
    if (tableId) {
      loadOrder(Number(tableId)).then((data) => {
        if (data) {
          setAdditionalPercentage(parseFloat(data["additionall procentage"] || "0"));
        }
      });
    }
  }, [tableId]);

  const getRemainingQuantity = (item: OrderItem) => {
    const selected = selectedItems.find(
      (s) => s.food.id === item.food.id && s.comment === item.comment
    );
    return item.quantity - (selected?.quantity || 0);
  };

  const fullOrderTotal = useMemo(() => {
    return (
      order?.items.reduce((acc, item) => acc + item.food.price * item.quantity, 0) ?? 0
    );
  }, [order]);

  const selectedTotal = useMemo(() => {
    return selectedItems.reduce((acc, item) => acc + item.food.price * item.quantity, 0);
  }, [selectedItems]);

  const handleSelectForPayment = (item: OrderItem) => {
    const remaining = getRemainingQuantity(item);
    if (remaining <= 0) {
      toast.warning("No remaining quantity to select.");
      return;
    }

    setSelectedItems((prev) => {
      const existingIndex = prev.findIndex(
        (selectedItem) =>
          selectedItem.food.id === item.food.id && selectedItem.comment === item.comment
      );

      if (existingIndex !== -1) {
        return prev.map((selectedItem, idx) =>
          idx === existingIndex
            ? { ...selectedItem, quantity: selectedItem.quantity + 1 }
            : selectedItem
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleFullPayment = async () => {
    if (!tableId) return;
    await handlepayFullOrder(Number(tableId));
    toast.success("Order fully paid!");
    router.push("/waiter");
  };

  const handlePartialPayment = async () => {
    if (!tableId || selectedItems.length === 0) {
      toast.error("No items selected for payment.");
      return;
    }

    const partialPaymentRequest: PartialPaymentRequest[] = selectedItems.map((item) => ({
      foodId: item.food.id,
      quantityToPay: item.quantity,
      comment: item.comment || "",
    }));

    await handlepayPartialOrder(Number(tableId), partialPaymentRequest);
    toast.success("Partial payment completed!");
    setSelectedItems([]);
    loadOrder(Number(tableId));
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Button
        size="sm"
        variant="outline"
        onClick={() => router.push("/waiter")}
      >
        ← Back
      </Button>

      <Card>
        
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            💳 Payment – Table {order?.table?.tableNumber || tableId}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-8 lg:flex-row">
          {/* Full Order */}
          <div className="w-full lg:w-1/2 space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-semibold">🛒 Full Order</h2>
              <p className="text-sm">💵 Total: ${fullOrderTotal.toFixed(2)}</p>
              <p className="text-sm">🔹 Additional: {additionalPercentage}%</p>
            </div>

            <div className="overflow-x-auto rounded border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order?.items.map((item, index) => {
                    const remainingQty = getRemainingQuantity(item);
                    return (
                      <TableRow key={index} className={remainingQty === 0 ? "opacity-50" : ""}>
                        <TableCell>{item.food.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{item.food.category.name}</Badge>
                        </TableCell>
                        <TableCell>${item.food.price.toFixed(2)}</TableCell>
                        <TableCell>
                          {remainingQty} / {item.quantity}
                        </TableCell>
                        <TableCell>{item.comment || "-"}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectForPayment(item)}
                            disabled={remainingQty <= 0}
                          >
                            ➕ Pay
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Selected Items */}
          <div className="w-full lg:w-1/2 space-y-4">
            <h2 className="text-base font-semibold">💰 Selected for Payment</h2>
            {selectedItems.length > 0 ? (
              <div className="overflow-x-auto rounded border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.food.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.comment || "-"}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <Trash className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <p className="text-right mt-2 text-sm font-medium">
                  Total: ${selectedTotal.toFixed(2)}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No items selected yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Button
          variant="outline"
          onClick={handlePartialPayment}
          disabled={selectedItems.length === 0}
          className="w-full sm:w-auto"
        >
          💰 Pay Selected
        </Button>
        <Button
          variant="destructive"
          onClick={handleFullPayment}
          className="w-full sm:w-auto"
        >
          ✅ Pay Full Order
        </Button>
      </div>
    </div>
  );
}
