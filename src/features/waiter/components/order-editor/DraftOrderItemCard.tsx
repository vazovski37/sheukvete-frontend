// src/features/waiter/components/order-editor/DraftOrderItemCard.tsx
import React from "react";
import type { OrderItemDraft } from "../../hooks/useDraftOrderLogic";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle, Trash2, Edit } from "lucide-react";

interface DraftOrderItemCardProps {
  item: OrderItemDraft;
  index: number;
  isUpdatingOrder: boolean;
  onQuantityChange: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void; // This is the correct prop name
  onOpenSplitDialog: (item: OrderItemDraft, index: number) => void;
}

export function DraftOrderItemCard({
  item,
  index,
  isUpdatingOrder,
  onQuantityChange,
  onRemoveItem, // Correctly destructured
  onOpenSplitDialog,
}: DraftOrderItemCardProps) {

  return (
    <div className="flex items-center gap-2 text-xs border-b pb-2 last:border-b-0">
      <div className="flex-grow">
        <p className="font-medium leading-tight">{item.name}</p>
        {item.comment && <p className="text-muted-foreground italic text-[0.7rem]">↳ {item.comment}</p>}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onQuantityChange(index, -1)} disabled={isUpdatingOrder || item.quantity <= 1}>
          <MinusCircle className="h-4 w-4" />
        </Button>
        <span className="w-5 text-center font-medium">{item.quantity}</span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onQuantityChange(index, 1)} disabled={isUpdatingOrder}>
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
      <p className="w-12 text-right shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
      <div className="flex items-center gap-0.5 shrink-0">
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onOpenSplitDialog(item, index)} disabled={isUpdatingOrder}>
          <Edit className="h-3 w-3 text-muted-foreground hover:text-foreground" />
        </Button>
        {/* Corrected line: */}
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onRemoveItem(index)} disabled={isUpdatingOrder}>
          <Trash2 className="h-3 w-3 text-destructive/80 hover:text-destructive" />
        </Button>
      </div>
    </div>
  );
}