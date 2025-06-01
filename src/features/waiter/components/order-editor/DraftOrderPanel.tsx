// src/features/waiter/components/order-editor/DraftOrderPanel.tsx
import React from "react";
import type { OrderItemDraft } from "../../hooks/useDraftOrderLogic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DraftOrderItemCard } from "./DraftOrderItemCard";
import { DraftOrderSummary } from "./DraftOrderSummary";

interface DraftOrderPanelProps {
  draftOrderItems: OrderItemDraft[];
  isUpdatingOrder: boolean;
  totalOrderPrice: number;
  onQuantityChange: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onSubmitOrder: () => void;
  // New prop for opening the split dialog
  onOpenSplitDialog: (item: OrderItemDraft, index: number) => void;

  // Removed props related to old inline comment editing:
  // editingCommentIndex, currentCommentText, onStartCommentEdit, onSaveComment, onCancelCommentEdit, onSetCurrentCommentText
}

export function DraftOrderPanel({
  draftOrderItems,
  isUpdatingOrder,
  totalOrderPrice,
  onQuantityChange,
  onRemoveItem,
  onSubmitOrder,
  onOpenSplitDialog, // Added
}: DraftOrderPanelProps) {
  return (
    <div className="lg:sticky lg:top-[calc(var(--header-height,64px)+1rem)]">
      <Card className="shadow-md">
        <CardHeader className="p-3 sm:p-4 border-b">
          <CardTitle className="text-lg">Current Draft</CardTitle>
        </CardHeader>
        <ScrollArea className="h-[calc(100vh-430px)] sm:h-[calc(100vh-400px)] min-h-[150px]">
          <CardContent className="p-3 sm:p-4 space-y-2.5">
            {draftOrderItems.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Select items from the menu.</p>
            ) : (
              draftOrderItems.map((item, index) => (
                <DraftOrderItemCard
                  key={`${item.foodId}-${item.comment}-${index}-${item.quantity}`} // Adjusted key for more uniqueness
                  item={item}
                  index={index}
                  isUpdatingOrder={isUpdatingOrder}
                  onQuantityChange={onQuantityChange}
                  onRemoveItem={onRemoveItem}
                  onOpenSplitDialog={onOpenSplitDialog} // Pass down
                />
              ))
            )}
          </CardContent>
        </ScrollArea>
        {draftOrderItems.length > 0 && (
          <DraftOrderSummary
            totalOrderPrice={totalOrderPrice}
            onSubmitOrder={onSubmitOrder}
            isUpdatingOrder={isUpdatingOrder}
          />
        )}
      </Card>
    </div>
  );
}