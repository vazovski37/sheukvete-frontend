// src/features/waiter/hooks/useDraftOrderLogic.ts
import { useState, useMemo, useCallback } from "react";
import type { WaiterDisplayFoodItem, WaiterOrderInputItem } from "../types";

export interface OrderItemDraft extends WaiterOrderInputItem {
  name: string;
  price: number;
}

// Interface for items being managed within the split dialog
export interface SubOrderItem {
  id: string; // Temporary ID for list management in dialog
  quantity: number;
  comment: string;
}


export function useDraftOrderLogic() {
  const [draftOrderItems, setDraftOrderItems] = useState<OrderItemDraft[]>([]);

  // State for the split item dialog
  const [isSplitItemDialogOpen, setIsSplitItemDialogOpen] = useState(false);
  const [itemToSplit, setItemToSplit] = useState<{ item: OrderItemDraft; index: number } | null>(null);


  const resetDraftOrder = useCallback(() => {
    setDraftOrderItems([]);
    setIsSplitItemDialogOpen(false);
    setItemToSplit(null);
  }, []);

  const handleAddItem = useCallback((food: WaiterDisplayFoodItem) => {
    setDraftOrderItems(prev => {
      const existingItemIndex = prev.findIndex(item => item.foodId === food.id && (item.comment === "" || !item.comment));
      if (existingItemIndex > -1) {
        const updatedItems = [...prev];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      }
      return [...prev, { foodId: food.id, quantity: 1, name: food.name, price: food.price, comment: "" }];
    });
  }, []);

  const handleAddCommentedItem = useCallback((food: WaiterDisplayFoodItem, presetComment: string) => {
    setDraftOrderItems(prev => {
      const existingItemIndex = prev.findIndex(item => item.foodId === food.id && item.comment === presetComment);
      if (existingItemIndex > -1) {
        const updatedItems = [...prev];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      }
      return [...prev, { foodId: food.id, quantity: 1, name: food.name, price: food.price, comment: presetComment }];
    });
  }, []);

  const handleQuantityChange = useCallback((index: number, delta: number) => {
    setDraftOrderItems(prev =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(1, item.quantity + delta) } // Prevent quantity from going below 1 here
          : item
      )
      // No filter here, removal is explicit via handleRemoveItem or splitting to 0 quantity
    );
  }, []);

  const handleRemoveItem = useCallback((index: number) => {
    setDraftOrderItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  // --- New Split Item Dialog Logic ---
  const openSplitItemDialog = useCallback((item: OrderItemDraft, index: number) => {
    setItemToSplit({ item, index });
    setIsSplitItemDialogOpen(true);
  }, []);

  const closeSplitItemDialog = useCallback(() => {
    setIsSplitItemDialogOpen(false);
    setItemToSplit(null);
  }, []);

  const handleConfirmSplitItem = useCallback(
    (
      originalItemIndex: number,
      foodId: number,
      name: string,
      price: number,
      processedSubItems: Array<{ quantity: number; comment: string }> // These are the items from the dialog
    ) => {
      setDraftOrderItems(prev => {
        const newDraft = [...prev];
        const itemsToInsert = processedSubItems
          .filter(subItem => subItem.quantity > 0) // Ensure only items with quantity > 0 are added
          .map(subItem => ({
            foodId,
            name,
            price,
            quantity: subItem.quantity,
            comment: subItem.comment.trim(),
          }));

        // Replace the original item at originalItemIndex with the new set of items
        newDraft.splice(originalItemIndex, 1, ...itemsToInsert);
        return newDraft;
      });
      closeSplitItemDialog();
    },
    [closeSplitItemDialog] // Add dependencies if this callback uses other state/props from the hook
  );

  const totalOrderPrice = useMemo(() => {
    return draftOrderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [draftOrderItems]);

  return {
    draftOrderItems,
    // Removed old comment state/handlers
    resetDraftOrder,
    handleAddItem,
    handleAddCommentedItem,
    handleQuantityChange,
    handleRemoveItem,
    totalOrderPrice,

    // New split item dialog state and handlers
    isSplitItemDialogOpen,
    itemToSplit,
    openSplitItemDialog,
    closeSplitItemDialog,
    handleConfirmSplitItem,
  };
}