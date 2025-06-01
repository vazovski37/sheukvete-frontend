// src/features/waiter/components/order-editor/DraftOrderSummary.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";

interface DraftOrderSummaryProps {
  totalOrderPrice: number;
  onSubmitOrder: () => void;
  isUpdatingOrder: boolean;
}

export function DraftOrderSummary({ totalOrderPrice, onSubmitOrder, isUpdatingOrder }: DraftOrderSummaryProps) {
  return (
    <CardFooter className="flex flex-col items-stretch gap-3 p-3 sm:p-4 border-t">
      <div className="flex justify-between font-semibold text-md">
        <span>Total:</span>
        <span>${totalOrderPrice.toFixed(2)}</span>
      </div>
      <Button size="lg" className="w-full" onClick={onSubmitOrder} disabled={isUpdatingOrder}>
        {isUpdatingOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
        Submit Order
      </Button>
    </CardFooter>
  );
}