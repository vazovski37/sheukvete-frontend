// src/features/waiter/components/OrderEditor.tsx
"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useWaiterOrderManagement } from "../hooks/useWaiterOrderManagement";
import { useWaiterAvailableFoods } from "../hooks/useWaiterAvailableFoods";
import { useDraftOrderLogic } from "../hooks/useDraftOrderLogic"; // OrderItemDraft already imported via this
import { fetchWaiterOrderByTableId } from "../api";
import type { WaiterDisplayOrder, WaiterOrderInputItem } from "../types";

import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

import { OrderEditorHeader } from "./order-editor/OrderEditorHeader";
import { FoodMenuTabs } from "./order-editor/FoodMenuTabs";
import { DraftOrderPanel } from "./order-editor/DraftOrderPanel";
import { SplitItemDialog } from "./order-editor/SplitItemDialog"; // Import the new dialog

export function OrderEditor() {
  const router = useRouter();
  const params = useParams();
  const tableId = Number(params.tableId);
  const queryClient = useQueryClient();

  const { availableFoods, isLoadingFoods } = useWaiterAvailableFoods();
  const { updateOrder, isUpdatingOrder } = useWaiterOrderManagement();

  const {
    draftOrderItems,
    resetDraftOrder,
    handleAddItem,
    handleAddCommentedItem,
    handleQuantityChange,
    handleRemoveItem, // Make sure this is correctly passed or available in DraftOrderItemCard
    totalOrderPrice,
    // New state and handlers from the hook
    isSplitItemDialogOpen,
    itemToSplit,
    openSplitItemDialog,
    closeSplitItemDialog,
    handleConfirmSplitItem,
  } = useDraftOrderLogic();

  const {
    data: initialOrderData,
    isLoading: isLoadingInitialOrder,
    isError: isInitialOrderError,
    error: initialOrderError,
  } = useQuery<WaiterDisplayOrder | null, Error>({
    queryKey: ["waiter", "order", tableId],
    queryFn: () => (tableId && !isNaN(tableId) ? fetchWaiterOrderByTableId(tableId) : Promise.resolve(null)),
    enabled: !!tableId && !isNaN(tableId),
    staleTime: 1 * 60 * 1000,
  });

  useEffect(() => {
    resetDraftOrder();
  }, [tableId, resetDraftOrder]);

  const handleSubmitOrder = async () => {
    if (!tableId || isNaN(tableId)) {
      toast.error("Invalid table ID.");
      return;
    }
    if (draftOrderItems.length === 0) {
      toast.info("Cannot submit an empty list. Add items to the draft.");
      return;
    }

    const orderInputItems: WaiterOrderInputItem[] = draftOrderItems.map(item => ({
      foodId: item.foodId,
      quantity: item.quantity,
      comment: item.comment || undefined,
    }));

    await updateOrder({ tableId, items: orderInputItems }, {
      onSuccess: () => {
        toast.success("Order submitted successfully!");
        queryClient.invalidateQueries({ queryKey: ["waiter", "order", tableId] });
        router.push(`/waiter/orders/view/${tableId}`);
      },
      onError: (error) => {
        console.error("Failed to submit order from component:", error);
      }
    });
  };

  if (isLoadingInitialOrder) {
    // ... loading skeleton ...
    return (
      <div className="p-4 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-10 w-1/2" /><Skeleton className="h-12 w-full" /><Skeleton className="h-40 w-full" />
        </div>
        <div className="space-y-4"><Skeleton className="h-10 w-3/4" /><Skeleton className="h-64 w-full" /><Skeleton className="h-10 w-full" /></div>
      </div>
    );
  }

  if (isInitialOrderError) {
    return <div className="p-4 text-center text-destructive">Error loading initial order data: {initialOrderError?.message}</div>
  }

  return (
    <div className="p-2 sm:p-4 max-w-6xl mx-auto">
      <OrderEditorHeader
        tableIdentifier={initialOrderData?.table?.tableNumber || tableId}
        onBack={() => router.back()}
        viewOrderTableId={tableId}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start mt-4">
        <div className="lg:col-span-2">
          <FoodMenuTabs
            availableFoods={availableFoods}
            isLoadingFoods={isLoadingFoods}
            onAddItem={handleAddItem}
            onAddCommentedItem={handleAddCommentedItem}
          />
        </div>

        <DraftOrderPanel
          draftOrderItems={draftOrderItems}
          isUpdatingOrder={isUpdatingOrder}
          totalOrderPrice={totalOrderPrice}
          onQuantityChange={handleQuantityChange}
          onRemoveItem={handleRemoveItem} // Ensure this is passed down correctly
          onSubmitOrder={handleSubmitOrder}
          onOpenSplitDialog={openSplitItemDialog} // Pass the handler
        />
      </div>

      {/* Render the dialog */}
      <SplitItemDialog
        isOpen={isSplitItemDialogOpen}
        onClose={closeSplitItemDialog}
        itemToSplit={itemToSplit}
        onConfirmSplit={handleConfirmSplitItem}
      />
    </div>
  );
}