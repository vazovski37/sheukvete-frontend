// src/features/waiter/components/OrderEditor.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useWaiterOrderManagement } from "../hooks/useWaiterOrderManagement";
import { useWaiterAvailableFoods } from "../hooks/useWaiterAvailableFoods";
import { fetchWaiterOrderByTableId } from "../api";
import type { 
    WaiterDisplayOrder, 
    WaiterOrderInputItem, 
    WaiterDisplayFoodItem, 
    WaiterDisplayCategoryWithFoods 
} from "../types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // For potential future use with comments
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { PlusCircle, MinusCircle, Trash2, Send, Undo2 as Undo, Edit, Save, Loader2, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";


interface OrderItemDraft extends WaiterOrderInputItem {
  name: string;
  price: number;
}

export function OrderEditor() {
  const router = useRouter();
  const params = useParams();
  const tableId = Number(params.tableId);
  const queryClient = useQueryClient();

  const { availableFoods, isLoadingFoods } = useWaiterAvailableFoods();
  const { updateOrder, isUpdatingOrder } = useWaiterOrderManagement();

  const { 
    data: initialOrderData, 
    isLoading: isLoadingInitialOrder,
    isError: isInitialOrderError,
    error: initialOrderError,
  } = useQuery<WaiterDisplayOrder | null, Error>({
    queryKey: ["waiter", "order", tableId],
    queryFn: () => (tableId && !isNaN(tableId) ? fetchWaiterOrderByTableId(tableId) : Promise.resolve(null)),
    enabled: !!tableId && !isNaN(tableId),
    staleTime: 1 * 60 * 1000, // Cache for 1 minute
  });

  const [draftOrderItems, setDraftOrderItems] = useState<OrderItemDraft[]>([]);
  
  // State for inline comment editing
  const [editingCommentIndex, setEditingCommentIndex] = useState<number | null>(null);
  const [currentCommentText, setCurrentCommentText] = useState("");

  useEffect(() => {
    if (initialOrderData && initialOrderData.items) {
      const loadedDraftItems = initialOrderData.items.map(item => ({
        foodId: item.food.id,
        quantity: item.quantity,
        comment: item.comment || "",
        name: item.food.name,
        price: item.food.price,
      }));
      setDraftOrderItems(loadedDraftItems);
    } else if (!isLoadingInitialOrder && !initialOrderData) { // If loaded and no order, reset draft
      setDraftOrderItems([]);
    }
  }, [initialOrderData, isLoadingInitialOrder]);

  const handleAddItem = (food: WaiterDisplayFoodItem) => {
    setDraftOrderItems(prev => {
      const existingItemIndex = prev.findIndex(item => item.foodId === food.id && (item.comment === "" || !item.comment)); // Merge if no custom comment
      if (existingItemIndex > -1) {
        const updatedItems = [...prev];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      }
      return [...prev, { foodId: food.id, quantity: 1, name: food.name, price: food.price, comment: "" }];
    });
  };
  
  const handleAddCommentedItem = (food: WaiterDisplayFoodItem, presetComment: string) => {
     setDraftOrderItems(prev => {
         const existingItemIndex = prev.findIndex(item => item.foodId === food.id && item.comment === presetComment);
         if (existingItemIndex > -1) {
             const updatedItems = [...prev];
             updatedItems[existingItemIndex].quantity += 1;
             return updatedItems;
         }
         return [...prev, { foodId: food.id, quantity: 1, name: food.name, price: food.price, comment: presetComment }];
     });
  };


  const handleQuantityChange = (index: number, delta: number) => {
    setDraftOrderItems(prev =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const handleRemoveItem = (index: number) => {
    setDraftOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  const startCommentEdit = (index: number) => {
    setEditingCommentIndex(index);
    setCurrentCommentText(draftOrderItems[index].comment || "");
  };

  const handleSaveComment = (index: number) => {
    setDraftOrderItems(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, comment: currentCommentText.trim() } : item
      )
    );
    setEditingCommentIndex(null);
    setCurrentCommentText("");
  };
  
  const totalOrderPrice = useMemo(() => {
    return draftOrderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [draftOrderItems]);

  const handleSubmitOrder = async () => {
    if (!tableId || isNaN(tableId)) {
      toast.error("Invalid table ID.");
      return;
    }
    if (draftOrderItems.length === 0 && (!initialOrderData || initialOrderData.items.length === 0)) {
      toast.info("Order is empty. Add items to place an order.");
      return;
    }

    const orderInputItems: WaiterOrderInputItem[] = draftOrderItems.map(item => ({
      foodId: item.foodId,
      quantity: item.quantity,
      comment: item.comment || undefined,
    }));

    await updateOrder({ tableId, items: orderInputItems }, {
      onSuccess: () => {
        toast.success("Order updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["waiter", "order", tableId] });
        // Optionally navigate to view order page or stay for more edits
        router.push(`/waiter/orders/view/${tableId}`);
      },
      onError: (error) => {
        // Error toast is handled by the hook
        console.error("Failed to submit order from component:", error);
      }
    });
  };

  const renderFoodList = (foodCategories: WaiterDisplayCategoryWithFoods[] | undefined, categoryType: "Meals" | "Drinks") => {
    if (isLoadingFoods && !foodCategories) return <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>;
    if (!foodCategories || foodCategories.length === 0) return <p className="text-muted-foreground text-sm p-4 text-center">No {categoryType.toLowerCase()} available.</p>;
    
    return foodCategories.map(catWithFoods => (
      <div key={catWithFoods.category.id} className="mb-4">
        <h3 className="font-semibold text-md mb-2 sticky top-0 bg-background/95 backdrop-blur-sm py-1.5 z-10 px-1">{catWithFoods.category.name}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {catWithFoods.food.map(food => (
            <Card key={food.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-3">
                <div className="flex justify-between items-start gap-2">
                    <div>
                        <p className="font-medium text-sm truncate">{food.name}</p>
                        <p className="text-xs text-muted-foreground">${food.price.toFixed(2)}</p>
                    </div>
                    <Button aria-label={`Add ${food.name}`} size="icon" variant="ghost" onClick={() => handleAddItem(food)} className="h-8 w-8 shrink-0">
                        <PlusCircle className="h-5 w-5 text-primary"/>
                    </Button>
                </div>
                { (food.comment1 || food.comment2 || food.comment3 || food.comment4) && (
                    <div className="mt-2 space-x-1 space-y-1">
                        {[food.comment1, food.comment2, food.comment3, food.comment4].map((pc, idx) => 
                            pc ? (
                            <Button key={idx} variant="outline" size="sm" className="text-[0.65rem] h-auto py-0.5 px-1.5" onClick={() => handleAddCommentedItem(food, pc)}>
                                + "{pc}"
                            </Button>
                            ) : null
                        )}
                    </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    ));
  };

  if (isLoadingInitialOrder) {
    return (
        <div className="p-4 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4"><Skeleton className="h-10 w-1/2" /><Skeleton className="h-12 w-full" /><Skeleton className="h-40 w-full" /></div>
            <div className="space-y-4"><Skeleton className="h-10 w-3/4" /><Skeleton className="h-64 w-full" /><Skeleton className="h-10 w-full" /></div>
        </div>
    );
  }
  if (isInitialOrderError) {
     return <div className="p-4 text-center text-destructive">Error loading initial order: {initialOrderError?.message}</div>
  }

  return (
    <div className="p-2 sm:p-4 max-w-6xl mx-auto">
      <CardHeader className="px-0 sm:px-2 pb-2 pt-0">
        <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
                <Undo className="mr-2 h-4 w-4" /> Back
            </Button>
            <CardTitle className="text-xl sm:text-2xl text-center">
              Order for Table {initialOrderData?.table?.tableNumber || tableId}
            </CardTitle>
            <Link href={`/waiter/orders/view/${tableId}`} passHref legacyBehavior>
                 <Button variant="ghost" size="sm" className="text-xs">
                     <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> View Full Order
                 </Button>
             </Link>
        </div>
        <CardDescription className="text-center sm:text-left">
          {initialOrderData?.items && initialOrderData.items.length > 0 ? "Modify existing items or add new ones." : "Select items to start a new order."}
        </CardDescription>
      </CardHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start mt-4">
        <div className="lg:col-span-2">
          <Card className="shadow-md">
            <CardHeader className="p-3 sm:p-4 border-b">
              <CardTitle className="text-lg">Menu</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="meals" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-11 rounded-none border-b">
                  <TabsTrigger value="meals" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Meals</TabsTrigger>
                  <TabsTrigger value="drinks" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Drinks</TabsTrigger>
                </TabsList>
                <ScrollArea className="h-[calc(100vh-260px)] sm:h-[calc(100vh-230px)]">
                  <div className="p-3 sm:p-4">
                     <TabsContent value="meals" className="mt-0">
                     {renderFoodList(availableFoods?.meals, "Meals")}
                     </TabsContent>
                     <TabsContent value="drinks" className="mt-0">
                     {renderFoodList(availableFoods?.drinks, "Drinks")}
                     </TabsContent>
                  </div>
                </ScrollArea>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky lg:top-[calc(var(--header-height,64px)+1rem)]"> {/* Adjust top based on your actual header height */}
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
                  <div key={`<span class="math-inline">\{item\.foodId\}\-</span>{item.comment}-${index}`} className="flex items-center gap-2 text-xs border-b pb-2 last:border-b-0">
                    <div className="flex-grow">
                      <p className="font-medium leading-tight">{item.name}</p>
                      { editingCommentIndex === index ? (
                         <div className="mt-1">
                             <Textarea
                                 value={currentCommentText}
                                 onChange={(e) => setCurrentCommentText(e.target.value)}
                                 placeholder="Add custom comment..."
                                 rows={2}
                                 className="text-xs h-auto"
                                 autoFocus
                             />
                             <div className="flex gap-1 mt-1 justify-end">
                                 <Button variant="ghost" size="sm" onClick={() => setEditingCommentIndex(null)}>Cancel</Button>
                                 <Button size="sm" onClick={() => handleSaveComment(index)}>Save</Button>
                             </div>
                         </div>
                      ) : (
                         item.comment && <p className="text-muted-foreground italic text-[0.7rem]">↳ {item.comment}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleQuantityChange(index, -1)} disabled={isUpdatingOrder}>
                        <MinusCircle className="h-4 w-4"/>
                      </Button>
                      <span className="w-5 text-center font-medium">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleQuantityChange(index, 1)} disabled={isUpdatingOrder}>
                        <PlusCircle className="h-4 w-4"/>
                      </Button>
                    </div>
                    <p className="w-12 text-right shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                    <div className="flex items-center gap-0.5 shrink-0">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => startCommentEdit(index)} disabled={isUpdatingOrder}>
                            <Edit className="h-3 w-3 text-muted-foreground hover:text-foreground"/>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveItem(index)} disabled={isUpdatingOrder}>
                            <Trash2 className="h-3 w-3 text-destructive/80 hover:text-destructive"/>
                        </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
             </ScrollArea>
            {draftOrderItems.length > 0 && (
              <CardFooter className="flex flex-col items-stretch gap-3 p-3 sm:p-4 border-t">
                <div className="flex justify-between font-semibold text-md">
                  <span>Total:</span>
                  <span>${totalOrderPrice.toFixed(2)}</span>
                </div>
                <Button size="lg" className="w-full" onClick={handleSubmitOrder} disabled={isUpdatingOrder}>
                  {isUpdatingOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  {initialOrderData?.items && initialOrderData.items.length > 0 ? "Update Order" : "Place New Order"}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}