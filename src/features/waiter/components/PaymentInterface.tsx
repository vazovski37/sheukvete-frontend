// src/features/waiter/components/PaymentInterface.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWaiterOrderByTableId } from "../api";
import { useWaiterOrderManagement } from "../hooks/useWaiterOrderManagement";
import type { WaiterDisplayOrder, WaiterDisplayOrderItem, PartialPaymentPayload } from "../types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// Checkbox might not be used directly here, but good to have if needed for item selection.
// import { Checkbox } from "@/components/ui/checkbox"; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator"; // Not used in current layout
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { AlertTriangle, ArrowLeft, CreditCard, Loader2, Minus, Plus, Receipt, Trash2 as Trash } from "lucide-react"; // Renamed Trash to avoid conflict
import { format, isValid, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
// CORRECTED IMPORT for Shadcn UI Select
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";

interface ItemToPay extends WaiterDisplayOrderItem {
  selectedQuantity: number;
}

export function PaymentInterface() {
  const router = useRouter();
  const params = useParams();
  const tableId = Number(params.tableId);
  const queryClient = useQueryClient();

  const { 
    payFullOrder, isPayingFullOrder, 
    payPartialOrder, isPayingPartialOrder 
  } = useWaiterOrderManagement();

  const {
    data: order,
    isLoading: isLoadingOrder,
    isError,
    error,
    refetch: refetchOrder,
  } = useQuery<WaiterDisplayOrder | null, Error>({
    queryKey: ["waiter", "order", tableId],
    queryFn: () => (tableId && !isNaN(tableId) ? fetchWaiterOrderByTableId(tableId) : Promise.resolve(null)),
    enabled: !!tableId && !isNaN(tableId),
  });

  const [itemsToPay, setItemsToPay] = useState<ItemToPay[]>([]);
  const [paymentType, setPaymentType] = useState<"full" | "partial">("full");
  const [additionalPercentage, setAdditionalPercentage] = useState(0);
  const [isMounted, setIsMounted] = useState(false); // Added for client-side only logic

  useEffect(() => {
    setIsMounted(true); // Set mounted on client
  }, []);


  useEffect(() => {
    if (order?.items) {
      const initialItems = order.items.map(item => ({
        ...item,
        selectedQuantity: 0, 
      }));
      setItemsToPay(initialItems);
       if (order["additionall procentage"]) {
        setAdditionalPercentage(parseFloat(order["additionall procentage"]) || 0);
      }
    } else {
      setItemsToPay([]);
      setAdditionalPercentage(0);
    }
  }, [order]);

  const handleItemQuantityChange = (itemId: number, delta: number) => {
    setItemsToPay(currentItems =>
      currentItems.map(item => {
        if (item.id === itemId) {
          const newQuantity = Math.max(0, Math.min(item.quantity, item.selectedQuantity + delta));
          return { ...item, selectedQuantity: newQuantity };
        }
        return item;
      })
    );
  };

  const handleSelectAllForPayment = (itemId: number) => {
     setItemsToPay(currentItems =>
      currentItems.map(item => 
        item.id === itemId ? { ...item, selectedQuantity: item.quantity } : item
      )
    );
  }
  
  const handleDeselectAllForPayment = (itemId: number) => {
     setItemsToPay(currentItems =>
      currentItems.map(item => 
        item.id === itemId ? { ...item, selectedQuantity: 0 } : item
      )
    );
  }

  const subtotalFullOrder = useMemo(() => {
    return order?.items.reduce((sum, item) => sum + item.food.price * item.quantity, 0) ?? 0;
  }, [order]);
  
  const additionalAmountFull = (subtotalFullOrder * additionalPercentage) / 100;
  const grandTotalFullOrder = subtotalFullOrder + additionalAmountFull;

  const subtotalPartialPayment = useMemo(() => {
    return itemsToPay.reduce((sum, item) => sum + item.food.price * item.selectedQuantity, 0);
  }, [itemsToPay]);

  const additionalAmountPartial = (subtotalPartialPayment * additionalPercentage) / 100;
  const grandTotalPartialPayment = subtotalPartialPayment + additionalAmountPartial;

  const handleProcessFullPayment = async () => {
    if (!order) return;
    await payFullOrder(order.table.id, {
      onSuccess: () => {
        toast.success(`Table ${order.table.tableNumber} paid in full. Order closed.`);
        queryClient.invalidateQueries({ queryKey: ["waiter", "order", tableId] });
        queryClient.invalidateQueries({ queryKey: ["waiter", "occupiedTables"] });
        router.push("/waiter");
      },
      onError: (err) => {
        toast.error(`Full payment failed: ${err.message}`);
      }
    });
  };

  const handleProcessPartialPayment = async () => {
    if (!order) return;
    const itemsForPayload: PartialPaymentPayload = itemsToPay
      .filter(item => item.selectedQuantity > 0)
      .map(item => ({
        foodId: item.food.id,
        comment: item.comment,
        quantityToPay: item.selectedQuantity,
      }));

    if (itemsForPayload.length === 0) {
      toast.info("No items selected for partial payment.");
      return;
    }

    await payPartialOrder({ tableId: order.table.id, items: itemsForPayload }, {
      onSuccess: () => {
        toast.success("Partial payment successful!");
        refetchOrder(); 
        setItemsToPay(currentItems => currentItems.map(it => ({...it, selectedQuantity: 0})));
      },
      onError: (err) => {
        toast.error(`Partial payment failed: ${err.message}`);
      }
    });
  };

  const isProcessingPayment = isPayingFullOrder || isPayingPartialOrder;

  if (!isMounted) return <Skeleton className="h-[500px] w-full" />; // Or null for SSR
  if (isLoadingOrder && !order) return <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  if (isError) return <div className="p-4 text-center text-destructive">Error loading order: {error?.message}</div>;
  if (!order) {
    return (
      <div className="p-4 text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
        <p>No active order found for Table {tableId}.</p>
        <Button onClick={() => router.push("/waiter")} className="mt-4">Back to Tables</Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => router.push(`/waiter/orders/view/${tableId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Order
        </Button>
        <h1 className="text-xl sm:text-2xl font-semibold">
          Payment - Table {order.table.tableNumber}
        </h1>
        <div className="w-24"></div> {/* Spacer */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Summary</CardTitle>
          <CardDescription>
            Order ID: #{order.id} | Placed: {isValid(parseISO(order.orderTime)) ? format(parseISO(order.orderTime), "PPpp") : "N/A"}
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="mb-4">
                <Label htmlFor="paymentType" className="text-sm">Payment Type</Label>
                {/* Using Shadcn Select */}
                <Select value={paymentType} onValueChange={(v) => setPaymentType(v as "full" | "partial")} disabled={isProcessingPayment}>
                    <SelectTrigger id="paymentType" className="mt-1">
                        <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="full">Full Payment</SelectItem>
                        <SelectItem value="partial">Partial Payment</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {paymentType === "partial" && (
                <div className="space-y-3 my-4 p-3 border rounded-md bg-muted/30">
                    <h3 className="text-md font-medium mb-2">Select Items for Partial Payment:</h3>
                    {itemsToPay.filter(item => item.quantity > 0).length > 0 ? ( // Only show if there are items with quantity > 0
                        itemsToPay.filter(item => item.quantity > 0).map((item) => ( // Filter out items with 0 original quantity
                            <div key={item.id} className="flex items-center justify-between gap-2 p-2 border-b last:border-b-0">
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{item.food.name} {item.comment && <span className="text-xs text-muted-foreground">({item.comment})</span>}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Remaining: {item.quantity - item.selectedQuantity} / {item.quantity} @ ${item.food.price.toFixed(2)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleItemQuantityChange(item.id, -1)} disabled={item.selectedQuantity <= 0 || isProcessingPayment}>
                                        <Minus className="h-3.5 w-3.5"/>
                                    </Button>
                                    <Input type="number" value={item.selectedQuantity} readOnly className="h-7 w-10 text-center text-xs p-0 border-0 bg-transparent" />
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleItemQuantityChange(item.id, 1)} disabled={item.selectedQuantity >= item.quantity || isProcessingPayment}>
                                        <Plus className="h-3.5 w-3.5"/>
                                    </Button>
                                    <div className="flex flex-col gap-0.5">
                                        <Button variant="outline" size="sm" className="h-[1.3rem] px-1.5 text-[0.65rem]" onClick={() => handleSelectAllForPayment(item.id)} disabled={item.selectedQuantity === item.quantity || isProcessingPayment}>All</Button>
                                        <Button variant="outline" size="sm" className="h-[1.3rem] px-1.5 text-[0.65rem]" onClick={() => handleDeselectAllForPayment(item.id)} disabled={item.selectedQuantity === 0 || isProcessingPayment}>None</Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No items available for partial payment in this order.</p>
                    )}
                </div>
            )}
        </CardContent>
        <CardFooter className="flex flex-col items-end gap-1 border-t pt-4">
            <p className="text-sm">
                Subtotal: 
                <span className="font-semibold">
                    ${(paymentType === 'full' ? subtotalFullOrder : subtotalPartialPayment).toFixed(2)}
                </span>
            </p>
            {additionalPercentage > 0 && (
                 <p className="text-xs text-muted-foreground">
                    Service Charge ({additionalPercentage}%): 
                    ${(paymentType === 'full' ? additionalAmountFull : additionalAmountPartial).toFixed(2)}
                </p>
            )}
            <p className="text-lg font-bold text-primary">
                Total Due: 
                ${(paymentType === 'full' ? grandTotalFullOrder : grandTotalPartialPayment).toFixed(2)}
            </p>
        </CardFooter>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        {paymentType === "full" ? (
          <Button onClick={handleProcessFullPayment} disabled={isProcessingPayment || (order?.items?.length || 0) === 0} size="lg" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
            {isPayingFullOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
            Confirm Full Payment
          </Button>
        ) : (
          <Button onClick={handleProcessPartialPayment} disabled={isProcessingPayment || itemsToPay.every(item => item.selectedQuantity === 0)} size="lg" className="flex-1">
            {isPayingPartialOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
            Confirm Partial Payment
          </Button>
        )}
        <Button variant="outline" size="lg" className="flex-1" onClick={() => router.push(`/waiter/orders/view/${tableId}`)}>
            Cancel Payment
        </Button>
      </div>
    </div>
  );
}