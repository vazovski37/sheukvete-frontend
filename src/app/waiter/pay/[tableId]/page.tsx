"use client";

import { useOrdersManagement } from "@/hooks/useOrdersManagement";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Minus, Plus, Trash } from "lucide-react";
import { OrderItem } from "@/types/order";
import { PartialPaymentRequest } from "@/types/waiter";

export default function PayOrderPage() {
  const { tableId } = useParams();
  const router = useRouter();
  const { order, loadOrder, handlepayFullOrder, handlepayPartialOrder } = useOrdersManagement();

  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [additionalPercentage, setAdditionalPercentage] = useState(0);

  useEffect(() => {
    if (tableId) {
      loadOrder(Number(tableId)).then((data) => {
        if (data) {
          setTotalAmount(parseFloat(data.totalamount || "0"));
          setAdditionalPercentage(parseFloat(data["additionall procentage"] || "0"));
        }
      });
    }
  }, [tableId]);

  // Select an item for partial payment (considering unique comment)
  const handleSelectForPayment = (item: OrderItem) => {
    setSelectedItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (selectedItem) => selectedItem.food.id === item.food.id && selectedItem.comment === item.comment
      );

      if (existingIndex !== -1) {
        return prevItems.map((selectedItem, idx) =>
          idx === existingIndex
            ? { ...selectedItem, quantity: Math.min(item.quantity, selectedItem.quantity + 1) }
            : selectedItem
        );
      }

      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  // Adjust quantity within valid limits
  const handleModifyQuantity = (index: number, change: number) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item, idx) =>
        idx === index
          ? {
              ...item,
              quantity: Math.max(
                1,
                Math.min(
                  item.quantity + change,
                  order?.items.find(
                    (oItem) => oItem.food.id === item.food.id && oItem.comment === item.comment
                  )?.quantity || 1
                )
              ),
            }
          : item
      )
    );
  };

  // Remove item from selection
  const handleRemoveItem = (index: number) => {
    setSelectedItems((prevItems) => prevItems.filter((_, idx) => idx !== index));
  };

  // Handle full payment
  const handleFullPayment = async () => {
    if (!tableId) return;
    await handlepayFullOrder(Number(tableId));
    toast.success("Order fully paid!");
    router.push("/waiter");
  };

  // Handle partial payment
  const handlePartialPayment = async () => {
    if (!tableId || selectedItems.length === 0) {
      toast.error("No items selected for payment.");
      return;
    }

    for (const selectedItem of selectedItems) {
      const originalItem = order?.items.find(
        (oItem) => oItem.food.id === selectedItem.food.id && oItem.comment === selectedItem.comment
      );
      if (!originalItem || selectedItem.quantity > originalItem.quantity) {
        toast.error(`Cannot pay more than ordered for ${selectedItem.food.name} (Comment: ${selectedItem.comment})`);
        return;
      }
    }

    const partialPaymentRequest: PartialPaymentRequest[] = selectedItems.map((item) => ({
      foodId: item.food.id,
      quantityToPay: item.quantity, // ✅ Correct field name
      comment: item.comment || "",
    }));

    await handlepayPartialOrder(Number(tableId), partialPaymentRequest);
    toast.success("Partial payment completed!");

    setSelectedItems([]); // Reset selection
    loadOrder(Number(tableId)); // Refresh order
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>💳 Payment for Table {order?.table?.tableNumber || tableId}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">🛒 Full Order</h2>
            <p className="text-md">💵 Total Amount: ${totalAmount.toFixed(2)}</p>
            <p className="text-md">🔹 Additional Charge: {additionalPercentage}%</p>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order?.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.food.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.food.category.name}</Badge>
                    </TableCell>
                    <TableCell>${item.food.price.toFixed(2)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.comment || "-"}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleSelectForPayment(item)}>
                        ➕ Select for Payment
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Selected Items for Partial Payment */}
          <div>
            <h2 className="text-lg font-semibold mb-3">💰 Selected for Payment</h2>
            {selectedItems.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.food.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.comment || "-"}</TableCell>
                      <TableCell>
                        <Button variant="destructive" size="icon" onClick={() => handleRemoveItem(index)}>
                          <Trash className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-gray-500">No items selected yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePartialPayment} disabled={selectedItems.length === 0}>
          💰 Pay Selected Items
        </Button>
        <Button variant="destructive" onClick={handleFullPayment}>
          ✅ Pay Full Order
        </Button>
      </div>
    </div>
  );
}
