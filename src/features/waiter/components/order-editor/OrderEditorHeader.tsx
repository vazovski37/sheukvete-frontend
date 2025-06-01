// src/features/waiter/components/order-editor/OrderEditorHeader.tsx
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Undo2 as Undo, ExternalLink } from "lucide-react";

interface OrderEditorHeaderProps {
  tableIdentifier: string | number;
  onBack: () => void;
  viewOrderTableId: number;
}

export function OrderEditorHeader({ tableIdentifier, onBack, viewOrderTableId }: OrderEditorHeaderProps) {
  return (
    <CardHeader className="px-0 sm:px-2 pb-2 pt-0">
      <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={onBack}>
          <Undo className="mr-2 h-4 w-4" /> Back
        </Button>
        <CardTitle className="text-xl sm:text-2xl text-center">
          Order for Table {tableIdentifier}
        </CardTitle>
        <Link href={`/waiter/orders/view/${viewOrderTableId}`} passHref legacyBehavior>
          <Button variant="ghost" size="sm" className="text-xs">
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> View Full Order
          </Button>
        </Link>
      </div>
      <CardDescription className="text-center sm:text-left">
        Add items to the order for this table.
      </CardDescription>
    </CardHeader>
  );
}