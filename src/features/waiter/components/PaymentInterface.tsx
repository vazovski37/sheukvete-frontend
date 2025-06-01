// src/features/waiter/components/PaymentInterface.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWaiterOrderByTableId } from "../api";
import { useWaiterOrderManagement } from "../hooks/useWaiterOrderManagement";
import type { WaiterDisplayOrder, WaiterDisplayOrderItem } from "../types";
import type { PartialPaymentRequest } from "@/types/waiter";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertTriangle, ArrowLeft, CreditCard, Loader2, Minus, Plus } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";

interface ItemToPay extends WaiterDisplayOrderItem {
  uniqueDisplayId: string;
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
  } = useQuery<WaiterDisplayOrder | null, Error>({
    queryKey: ["waiter", "order", tableId],
    queryFn: () => (tableId && !isNaN(tableId) ? fetchWaiterOrderByTableId(tableId) : Promise.resolve(null)),
    enabled: !!tableId && !isNaN(tableId),
  });

  const [itemsToPay, setItemsToPay] = useState<ItemToPay[]>([]);
  const [paymentType, setPaymentType] = useState<"full" | "partial">("full");
  const [additionalPercentage, setAdditionalPercentage] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [triggerRedirectCheck, setTriggerRedirectCheck] = useState(false); // Corrected initial state

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (order && Array.isArray(order.items)) { // Ensure order and order.items are valid
      const initialItems = order.items.map((item, index) => {
        // Defensive check for item.id and item.food before creating uniqueDisplayId
        const baseId = item?.id?.toString() || 'unknown_id';
        const foodName = item?.food?.name || 'unknown_food';
        const uniqueDisplayId = `${baseId}-${foodName}-${item?.comment || 'no_comment'}-${index}`;
        return {
          ...item,
          uniqueDisplayId: uniqueDisplayId,
          selectedQuantity: 0,
        };
      });
      setItemsToPay(initialItems);

      if (order["additionall procentage"]) {
        setAdditionalPercentage(parseFloat(order["additionall procentage" as keyof WaiterDisplayOrder] as string) || 0);
      } else {
        setAdditionalPercentage(0);
      }
    } else {
      setItemsToPay([]);
      setAdditionalPercentage(0);
    }
  }, [order]);

  useEffect(() => {
    if (triggerRedirectCheck && order && Array.isArray(order.items)) { // Ensure order.items is an array
      const allItemsEffectivelyPaid = order.items.every(item => item.paidForWaiter || item.quantity === 0);
      if (allItemsEffectivelyPaid) {
        toast.info("All items paid for this order. Redirecting...");
        queryClient.invalidateQueries({ queryKey: ["waiter", "occupiedTables"] });
        router.push("/waiter");
      }
      setTriggerRedirectCheck(false); 
    } else if (triggerRedirectCheck && order && !Array.isArray(order.items)) {
      // If order exists but items is not an array (e.g. after a payment might clear it to null/undefined from backend)
      // and if your API means "no items" implies order is settled, you might redirect here too.
      // This depends on API behavior. For now, assuming an empty array or all items paid.
      setTriggerRedirectCheck(false); // Reset anyway
    }
  }, [order, triggerRedirectCheck, router, queryClient]);


  const handleItemQuantityChange = (uniqueDisplayIdToUpdate: string, delta: number) => {
    setItemsToPay(currentItems =>
      currentItems.map(item => {
        if (item.uniqueDisplayId === uniqueDisplayIdToUpdate) {
          if (item.paidForWaiter) {
            return item;
          }
          const maxSelectableForThisItem = item.quantity;
          const newSelectedQuantity = Math.max(0, Math.min(maxSelectableForThisItem, item.selectedQuantity + delta));
          return { ...item, selectedQuantity: newSelectedQuantity };
        }
        return item;
      })
    );
  };

  const handleSelectAllForPayment = (uniqueDisplayIdToUpdate: string) => {
    setItemsToPay(currentItems =>
      currentItems.map(item => {
        if (item.uniqueDisplayId === uniqueDisplayIdToUpdate && !item.paidForWaiter) {
          return { ...item, selectedQuantity: item.quantity };
        }
        return item;
      })
    );
  }

  const handleDeselectAllForPayment = (uniqueDisplayIdToUpdate: string) => {
    setItemsToPay(currentItems =>
      currentItems.map(item =>
        (item.uniqueDisplayId === uniqueDisplayIdToUpdate && !item.paidForWaiter) ? { ...item, selectedQuantity: 0 } : item
      )
    );
  }

  const subtotalFullOrder = useMemo(() => { // Line 144-145
    if (!order || !Array.isArray(order.items) || order.items.length === 0) {
      return 0;
    }
    return order.items.reduce((sum, item) => {
      const price = item?.food?.price;
      const quantity = item?.quantity;
      if (typeof price === 'number' && typeof quantity === 'number') {
        return sum + (item.paidForWaiter ? 0 : (price * quantity));
      }
      return sum;
    }, 0);
  }, [order]);

  const additionalAmountFull = (subtotalFullOrder * additionalPercentage) / 100;
  const grandTotalFullOrder = subtotalFullOrder + additionalAmountFull;

  const subtotalPartialPayment = useMemo(() => {
    if (!Array.isArray(itemsToPay) || itemsToPay.length === 0) {
      return 0;
    }
    return itemsToPay.reduce((sum, item) => {
      const price = item?.food?.price;
      const selectedQuantity = item?.selectedQuantity;
      if (typeof price === 'number' && typeof selectedQuantity === 'number') {
        return sum + price * selectedQuantity;
      }
      return sum;
    }, 0);
  }, [itemsToPay]);

  const additionalAmountPartial = (subtotalPartialPayment * additionalPercentage) / 100;
  const grandTotalPartialPayment = subtotalPartialPayment + additionalAmountPartial;

  const handleProcessFullPayment = async () => {
    if (!order || !Array.isArray(order.items) || order.items.filter(item => !item.paidForWaiter).length === 0) {
        toast.info("Order is already fully paid or has no payable items.");
        return;
    }
    await payFullOrder(order.table.id, {
      onSuccess: () => {
        router.push("/waiter");
      },
      onError: (err: Error) => { /* Handled by hook */ }
    });
  };

  const handleProcessPartialPayment = async () => {
    if (!order) return;

    const itemsForApiPayload: PartialPaymentRequest[] = itemsToPay
      .filter(item => item.selectedQuantity > 0 && !item.paidForWaiter && item.food) // Ensure item.food exists
      .map(item => {
        const payloadItem: PartialPaymentRequest = {
          foodId: item.food.id, // item.food is now guaranteed to exist by filter
          quantityToPay: item.selectedQuantity,
        };
        if (item.comment && item.comment.trim() !== "") {
          payloadItem.comment = item.comment.trim();
        }
        return payloadItem;
      });

    if (itemsForApiPayload.length === 0) {
      toast.info("No items selected for partial payment or selected items are already paid.");
      return;
    }

    await payPartialOrder({ tableId: order.table.id, items: itemsForApiPayload }, {
      onSuccess: () => {
        setTriggerRedirectCheck(true);
      },
      onError: (err: Error) => { /* Handled by hook */ }
    });
  };

  const isProcessingPayment = isPayingFullOrder || isPayingPartialOrder;

  const allOriginalItemsEffectivelyPaid = useMemo(() => {
    if (!order || !Array.isArray(order.items)) {
      return true; 
    }
    if (order.items.length === 0) {
      return true; 
    }
    return order.items.every(item => item.paidForWaiter || item.quantity === 0);
  }, [order]);

  if (!isMounted) return <Skeleton className="h-[500px] w-full" />;
  
  // Early return if order is loading and not yet available.
  // This can prevent trying to access order.items before order is fully loaded.
  if (isLoadingOrder && !order) {
      return <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }
  
  if (isError) return <div className="p-4 text-center text-destructive">Error loading order: {error?.message}</div>;

  // This check should now be safer due to isLoadingOrder check above and robust calculations
  if (!order || !Array.isArray(order.items) || (order.items.length === 0 && !isLoadingOrder)) {
    // If order.items is not an array, treat as no active order or empty.
    // The !Array.isArray(order.items) handles cases where order might be an object but order.items is undefined/null
    if (order && !Array.isArray(order.items) && !isLoadingOrder) {
        // If order object exists but items is not an array, it's a problematic state.
        // console.warn("Order data is present but order.items is not an array:", order);
    }
    return (
      <div className="p-4 text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
        <p>No active order found for Table {tableId} or order is empty.</p>
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
          Payment - Table {order.table?.tableNumber || tableId}
        </h1>
        <div className="w-24"></div> {/* Spacer */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Summary</CardTitle>
          <CardDescription>
            Order ID: #{order.id} | Placed: {(typeof order.orderTime === 'string' && isValid(parseISO(order.orderTime))) ? format(parseISO(order.orderTime), "PPpp") : "N/A"}
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="mb-4">
                <Label htmlFor="paymentType" className="text-sm">Payment Type</Label>
                <Select
                    value={paymentType}
                    onValueChange={(v) => setPaymentType(v as "full" | "partial")}
                    disabled={isProcessingPayment || allOriginalItemsEffectivelyPaid}
                >
                    <SelectTrigger id="paymentType" className="mt-1">
                        <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="full" disabled={allOriginalItemsEffectivelyPaid}>Full Payment</SelectItem>
                        <SelectItem value="partial" disabled={allOriginalItemsEffectivelyPaid}>Partial Payment</SelectItem>
                    </SelectContent>
                </Select>
                {allOriginalItemsEffectivelyPaid && <p className="text-xs text-green-600 mt-1">This order is fully paid.</p>}
            </div>

            {paymentType === "partial" && !allOriginalItemsEffectivelyPaid && (
                <div className="space-y-3 my-4 p-3 border rounded-md bg-muted/30">
                    <h3 className="text-md font-medium mb-2">Select Items for Partial Payment:</h3>
                    {itemsToPay.filter(item => !item.paidForWaiter && item.quantity > 0).length > 0 ? (
                        itemsToPay.filter(item => !item.paidForWaiter && item.quantity > 0).map((item) => {
                            const originalQuantityOfThisLineItem = item.quantity;
                            return (
                                <div key={item.uniqueDisplayId} className="flex items-center justify-between gap-2 p-2 border-b last:border-b-0">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{item.food?.name || 'N/A'} {item.comment && <span className="text-xs text-muted-foreground">({item.comment})</span>}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Selected: {item.selectedQuantity} / {originalQuantityOfThisLineItem} @ ${(item.food?.price || 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Button variant="ghost" size="icon" className="h-7 w-7"
                                                onClick={() => handleItemQuantityChange(item.uniqueDisplayId, -1)}
                                                disabled={item.selectedQuantity <= 0 || isProcessingPayment}>
                                            <Minus className="h-3.5 w-3.5"/>
                                        </Button>
                                        <Input type="number" value={item.selectedQuantity} readOnly className="h-7 w-10 text-center text-xs p-0 border-0 bg-transparent" />
                                        <Button variant="ghost" size="icon" className="h-7 w-7"
                                                onClick={() => handleItemQuantityChange(item.uniqueDisplayId, 1)}
                                                disabled={item.selectedQuantity >= originalQuantityOfThisLineItem || isProcessingPayment}>
                                            <Plus className="h-3.5 w-3.5"/>
                                        </Button>
                                        <div className="flex flex-col gap-0.5">
                                            <Button variant="outline" size="sm" className="h-[1.3rem] px-1.5 text-[0.65rem]"
                                                    onClick={() => handleSelectAllForPayment(item.uniqueDisplayId)}
                                                    disabled={item.selectedQuantity === originalQuantityOfThisLineItem || isProcessingPayment}>All</Button>
                                            <Button variant="outline" size="sm" className="h-[1.3rem] px-1.5 text-[0.65rem]"
                                                    onClick={() => handleDeselectAllForPayment(item.uniqueDisplayId)}
                                                    disabled={item.selectedQuantity === 0 || isProcessingPayment}>None</Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">All items have been paid or no unpaid items in the order.</p>
                    )}
                </div>
            )}
        </CardContent>
        <CardFooter className="flex flex-col items-end gap-1 border-t pt-4">
            <p className="text-sm">
                Subtotal:
                <span className="font-semibold ml-1">
                    ${(paymentType === 'full' ? subtotalFullOrder : subtotalPartialPayment).toFixed(2)}
                </span>
            </p>
            {additionalPercentage > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Service Charge ({additionalPercentage}%):
                    <span className="ml-1">
                      ${(paymentType === 'full' ? additionalAmountFull : additionalAmountPartial).toFixed(2)}
                    </span>
                </p>
            )}
            <p className="text-lg font-bold text-primary">
                Total Due:
                <span className="ml-1">
                  ${(paymentType === 'full' ? grandTotalFullOrder : grandTotalPartialPayment).toFixed(2)}
                </span>
            </p>
        </CardFooter>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        {paymentType === "full" ? (
          <Button onClick={handleProcessFullPayment} disabled={isProcessingPayment || allOriginalItemsEffectivelyPaid} size="lg" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
            {isPayingFullOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
            Confirm Full Payment
          </Button>
        ) : (
          <Button onClick={handleProcessPartialPayment} disabled={isProcessingPayment || itemsToPay.every(item => item.selectedQuantity === 0) || allOriginalItemsEffectivelyPaid} size="lg" className="flex-1">
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