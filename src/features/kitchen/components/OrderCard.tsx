'use client'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KitchenOrder } from "../types";
import { format } from "date-fns";
import { toggleCookingStatus, printKitchenItems } from "../kitchenApi";
import { useTransition, useState } from "react";
import clsx from "clsx";

interface OrderCardProps {
  order: KitchenOrder;
  onStatusChange?: () => void;
}

export function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const [isPending, startTransition] = useTransition();
  const [localCooking, setLocalCooking] = useState(order.cooking);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [expanded, setExpanded] = useState(false);

  const toggleItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedItems(order.items.map((i) => i.orderItemId));
  };

  const handlePrint = async () => {
    try {
      await printKitchenItems({
        tableId: order.tableId,
        orderItemIds: selectedItems,
      });
      setSelectedItems([]);
      onStatusChange?.();
    } catch (err) {
      console.error("Failed to print kitchen items", err);
    }
  };

  const handleToggleCooking = () => {
    startTransition(async () => {
      try {
        await toggleCookingStatus(order.tableId);
        setLocalCooking((prev) => !prev);
        onStatusChange?.();
      } catch (error) {
        console.error("Failed to toggle cooking", error);
      }
    });
  };

  const status = localCooking ? (
    <Badge variant="default">Cooking</Badge>
  ) : (
    <Badge variant="secondary">Waiting</Badge>
  );

  return (
    <Card className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
      <CardHeader className="flex flex-col items-start gap-1">
        <CardTitle>Table #{order.tableNumber}</CardTitle>
        <div className="text-sm text-muted-foreground">
          Waiter: {order.waiterName}
        </div>
        <div className="text-xs text-muted-foreground">
          {format(new Date(order.orderTime), "HH:mm:ss, MMM dd")}
        </div>
        {status}
      </CardHeader>

        <CardContent className="space-y-1">
        {order.items.map((item) => (
            <div
            key={item.orderItemId}
            className={clsx(
                "flex justify-between text-sm border p-1 rounded cursor-pointer",
                selectedItems.includes(item.orderItemId)
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
            onClick={(e) => {
                e.stopPropagation();
                setExpanded(true); // ✅ ensure expanded when item is clicked
                toggleItem(item.orderItemId); // ✅ toggle selection
            }}
            >
            <span>
                {item.foodName} {item.comment && `(${item.comment})`}
            </span>
            <span>x{item.quantity}</span>
            </div>
        ))}
        </CardContent>

    {expanded && (
    <CardFooter className="flex flex-col items-stretch gap-2 mt-4 border-t pt-4">
        <div className="flex justify-end">
        <Button
        className="w-full"
            variant="outline"
            size="sm"
            onClick={(e) => {
            e.stopPropagation();
            selectAll();
            }}
        >
            Select All
        </Button>
        </div>

        <Button
        className="w-full"
        variant="secondary"
        onClick={(e) => {
            e.stopPropagation();
            handleToggleCooking();
        }}
        disabled={isPending}
        >
        {localCooking ? "Mark as Waiting" : "Mark as Cooking"}
        </Button>

        {selectedItems.length > 0 && (
        <Button
            className="w-full"
            onClick={(e) => {
            e.stopPropagation();
            handlePrint();
            }}
        >
            🖨️ Print Selected ({selectedItems.length})
        </Button>
        )}
    </CardFooter>
    )}
    </Card>
  );
}
