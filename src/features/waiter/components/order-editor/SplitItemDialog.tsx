// src/features/waiter/components/order-editor/SplitItemDialog.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, MinusCircle, Trash2, Save } from "lucide-react";
import type { OrderItemDraft, SubOrderItem } from "../../hooks/useDraftOrderLogic";
import { toast } from "sonner";

const generateId = () => Math.random().toString(36).substr(2, 9);

interface SplitItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemToSplit: { item: OrderItemDraft; index: number } | null;
  onConfirmSplit: (
    originalItemIndex: number,
    foodId: number,
    name: string,
    price: number,
    processedSubItems: Array<{ quantity: number; comment: string }>
  ) => void;
}

export function SplitItemDialog({ isOpen, onClose, itemToSplit, onConfirmSplit }: SplitItemDialogProps) {
  const [subItems, setSubItems] = useState<SubOrderItem[]>([]);
  const [editableTargetQuantity, setEditableTargetQuantity] = useState<number>(0);

  useEffect(() => {
    if (itemToSplit) {
      setEditableTargetQuantity(itemToSplit.item.quantity);
      setSubItems([
        {
          id: generateId(),
          quantity: itemToSplit.item.quantity,
          comment: itemToSplit.item.comment || "",
        },
      ]);
    } else {
      setSubItems([]);
      setEditableTargetQuantity(0);
    }
  }, [isOpen, itemToSplit]);

  const totalQuantityInDialog = useMemo(() => {
    return subItems.reduce((sum, sItem) => sum + sItem.quantity, 0);
  }, [subItems]);

  const canSaveChanges = useMemo(() => {
     if (editableTargetQuantity === 0) {
        return subItems.every(si => si.quantity === 0) || subItems.length === 0;
     }
     return totalQuantityInDialog === editableTargetQuantity &&
            editableTargetQuantity > 0 &&
            subItems.every(si => si.quantity > 0);
  }, [totalQuantityInDialog, editableTargetQuantity, subItems]);

  const canAddNewSplit = useMemo(() => {
    if (!itemToSplit || editableTargetQuantity <= 0) return false;
    if (subItems.length === 0 && editableTargetQuantity > 0) return true;
    if (totalQuantityInDialog < editableTargetQuantity) return true;
    if (totalQuantityInDialog === editableTargetQuantity) {
      return subItems.some(si => si.quantity > 1);
    }
    return false;
  }, [subItems, totalQuantityInDialog, editableTargetQuantity, itemToSplit]);

  const handleTargetQuantityChange = (newTarget: number) => {
    const newQty = Math.max(0, newTarget);
    setEditableTargetQuantity(newQty);
    if (subItems.length === 1) {
      setSubItems([{ ...subItems[0], quantity: newQty }]);
    } else if (newQty === 0) {
        toast.info("Target quantity set to 0. Adjust parts or they will be removed on save.");
    }
  };

  const handleSubItemQuantityChange = (subItemId: string, newQuantity: number) => {
    setSubItems(currentSubItems =>
      currentSubItems.map(si =>
        si.id === subItemId ? { ...si, quantity: Math.max(0, newQuantity) } : si
      )
    );
  };

  const handleSubItemCommentChange = (subItemId: string, newComment: string) => {
    setSubItems(currentSubItems =>
      currentSubItems.map(si => (si.id === subItemId ? { ...si, comment: newComment } : si))
    );
  };

  const handleAddSplit = () => {
    if (!canAddNewSplit) {
      toast.info("Cannot add new part. Adjust total target quantity or ensure an existing part can be split (quantity > 1).");
      return;
    }
    if (subItems.length === 0 && editableTargetQuantity > 0) {
        setSubItems([{id: generateId(), quantity: editableTargetQuantity, comment: ""}]);
        return;
    }
    if (totalQuantityInDialog < editableTargetQuantity) {
      const quantityForNewSplit = Math.min(1, editableTargetQuantity - totalQuantityInDialog);
      setSubItems(prev => [...prev, { id: generateId(), quantity: quantityForNewSplit, comment: "" }]);
    } else {
      setSubItems(prev => {
        let splitTaken = false;
        const updatedSubItems = prev.map(si => {
          if (!splitTaken && si.quantity > 1) {
            splitTaken = true;
            return { ...si, quantity: si.quantity - 1 };
          }
          return si;
        });
        if (splitTaken) {
          return [...updatedSubItems, { id: generateId(), quantity: 1, comment: "" }];
        }
        return prev;
      });
    }
  };

  const handleRemoveSplit = (subItemIdToRemove: string) => {
    if (subItems.length <= 1 && editableTargetQuantity > 0) {
      toast.info("Cannot remove the last part if target quantity > 0. Adjust its quantity or change the total target quantity to 0.");
      return;
    }
    const itemToRemove = subItems.find(si => si.id === subItemIdToRemove);
    if (!itemToRemove) return;

    setSubItems(currentSubItems => {
      const newSubItems = currentSubItems.filter(si => si.id !== subItemIdToRemove);
      if (newSubItems.length > 0 && itemToRemove.quantity > 0) {
        newSubItems[0].quantity += itemToRemove.quantity;
      }
      return newSubItems;
    });
  };

  const handleSaveChanges = () => {
    if (!itemToSplit) return;

    if (editableTargetQuantity === 0) {
        onConfirmSplit(itemToSplit.index, itemToSplit.item.foodId, itemToSplit.item.name, itemToSplit.item.price, []);
        onClose();
        return;
    }
    if (totalQuantityInDialog !== editableTargetQuantity) {
      toast.error(`Sum of parts (${totalQuantityInDialog}) must match target (${editableTargetQuantity}).`);
      return;
    }
    if (subItems.some(si => si.quantity <= 0)) {
      toast.error("All parts must have quantity > 0 if target is > 0.");
      return;
    }
    const processedSubItems = subItems.map(({ quantity, comment }) => ({ quantity, comment }));
    onConfirmSplit(
      itemToSplit.index,
      itemToSplit.item.foodId,
      itemToSplit.item.name,
      itemToSplit.item.price,
      processedSubItems
    );
    onClose();
  };

  if (!itemToSplit) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      {/* Fixed height for the dialog, overflow-y-hidden to prevent dialog itself from scrolling */}
      <DialogContent className="sm:max-w-lg md:max-w-xl h-[85vh] flex flex-col p-4 sm:p-6 overflow-y-hidden">
        <DialogHeader className="pr-6 sm:pr-0 flex-shrink-0">
          <DialogTitle className="text-lg sm:text-xl">Edit: {itemToSplit.item.name}</DialogTitle>
        </DialogHeader>

        <div className="py-3 pr-1 border-b mb-2 flex-shrink-0">
            <Label htmlFor="targetQuantity" className="text-sm font-medium block mb-1.5">
                New Total Target for <span className="font-semibold">{itemToSplit.item.name}</span>
            </Label>
            <div className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={() => handleTargetQuantityChange(editableTargetQuantity - 1)} disabled={editableTargetQuantity <= 0}>
                    <MinusCircle className="h-4 w-4" />
                </Button>
                <Input
                    id="targetQuantity"
                    type="number"
                    value={editableTargetQuantity}
                    onChange={(e) => handleTargetQuantityChange(parseInt(e.target.value, 10) || 0)}
                    className="w-20 text-center h-9 text-base font-semibold flex-shrink sm:flex-shrink-0"
                    min={0}
                />
                <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={() => handleTargetQuantityChange(editableTargetQuantity + 1)}>
                    <PlusCircle className="h-4 w-4" />
                </Button>
                <p className="text-xs sm:text-sm text-muted-foreground ml-0 sm:ml-2 mt-1 sm:mt-0 basis-full sm:basis-auto text-left sm:text-left order-last sm:order-none">
                    Sum of parts: <strong className={totalQuantityInDialog !== editableTargetQuantity ? 'text-destructive' : (editableTargetQuantity === 0 ? 'text-muted-foreground' : 'text-green-600')}>{totalQuantityInDialog}</strong>
                </p>
            </div>
             {editableTargetQuantity > 0 && totalQuantityInDialog !== editableTargetQuantity && (
              <p className="text-xs text-destructive mt-1">Parts sum must equal {editableTargetQuantity}.</p>
            )}
        </div>

        {/* ScrollArea takes remaining space and scrolls its content. min-h-0 is crucial for flex-grow in scrollable content. */}
        <ScrollArea className="flex-grow -mx-4 sm:-mx-6 px-4 sm:px-6 min-h-0">
          <div className="space-y-3 sm:space-y-4 py-2">
            {subItems.length > 0 ? subItems.map((sItem, index) => (
              <div key={sItem.id} className="p-2.5 sm:p-3 border rounded-md space-y-2 bg-card shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs sm:text-sm font-medium">
                    Part {index + 1}
                    <span className="text-muted-foreground font-normal hidden sm:inline"> (Unit Price: ${itemToSplit.item.price.toFixed(2)})</span>
                  </p>
                  {(subItems.length > 1 || (subItems.length === 1 && editableTargetQuantity === 0)) && (
                     <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-7 sm:w-7 text-destructive/80 hover:text-destructive" onClick={() => handleRemoveSplit(sItem.id)}>
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={() => handleSubItemQuantityChange(sItem.id, sItem.quantity - 1)} disabled={sItem.quantity <= 0}>
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={sItem.quantity}
                    onChange={(e) => {
                        const newQty = parseInt(e.target.value, 10);
                        handleSubItemQuantityChange(sItem.id, isNaN(newQty) ? 0 : newQty);
                    }}
                    className="w-16 sm:w-[70px] text-center h-8 text-sm"
                    min={0}
                  />
                  <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={() => handleSubItemQuantityChange(sItem.id, sItem.quantity + 1)}>
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                  <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap ml-auto pl-1 sm:pl-2">
                    Subtotal: ${(sItem.quantity * itemToSplit.item.price).toFixed(2)}
                  </span>
                </div>
                <Textarea
                  placeholder={`Comment for part ${index + 1}`}
                  value={sItem.comment}
                  onChange={(e) => handleSubItemCommentChange(sItem.id, e.target.value)}
                  rows={2}
                  className="text-xs sm:text-sm"
                />
              </div>
            )) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                    {editableTargetQuantity > 0 ? "Click 'Add Part' to define specifications." : "Set target quantity > 0 to add parts."}
                </p>
            )}
          </div>
        </ScrollArea>

         <Button variant="outline" size="sm" onClick={handleAddSplit} className="mt-3 self-start text-xs sm:text-sm flex-shrink-0" disabled={!canAddNewSplit}>
            <PlusCircle className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4"/> Add Part
        </Button>

        <DialogFooter className="mt-4 pt-3 border-t flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0 flex-shrink-0">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => onClose()}>Cancel</Button>
          </DialogClose>
          <Button onClick={handleSaveChanges} className="w-full sm:w-auto" disabled={!canSaveChanges}>
            <Save className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4"/> Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}