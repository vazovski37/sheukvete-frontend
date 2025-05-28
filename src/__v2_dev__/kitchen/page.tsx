'use client'

import { useKitchen } from "@/hooks/useKitchen";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function KitchenManagement() {
  const { orders, loading, loadOrders, handleToggleCookingStatus, handlePrintKitchenOrder } = useKitchen();
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Auto-refresh orders every 5 seconds without flickering
  useEffect(() => {
    const interval = setInterval(() => {
      loadOrders(); 
    }, 5000);
    return () => clearInterval(interval);
  }, [loadOrders]);

  const handleSelectOrder = (tableId: number, itemId: number) => {
    setSelectedTable(tableId);
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Kitchen Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders available</p>
          ) : (
            orders.map((order) => (
              <div key={order.tableId} className="border p-4 rounded-lg mb-4">
                <p><strong>Table:</strong> {order.tableNumber}</p>
                <p><strong>Waiter:</strong> {order.waiterName}</p>
                <p><strong>Order Time:</strong> {new Date(order.orderTime).toLocaleString()}</p>
                <p><strong>Cooking:</strong> {order.cooking ? "Yes" : "No"}</p>
                <Button
                  onClick={() => handleToggleCookingStatus(order.tableNumber)}
                  className="mt-2"
                >
                  Toggle Cooking Status
                </Button>
                <div className="mt-4">
                  <p><strong>Items:</strong></p>
                  {order.items.map((item) => (
                    <div key={item.orderItemId} className="flex items-center gap-2 py-1">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.orderItemId)}
                        onChange={() => handleSelectOrder(order.tableNumber, item.orderItemId)}
                      />
                      <span>{item.foodName} (x{item.quantity}) - {item.comment || "No comment"}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {selectedTable && selectedItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Print Selected Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                handlePrintKitchenOrder(selectedTable, selectedItems);
                setSelectedItems([]);
                setSelectedTable(null);
                toast.success("Items sent to print!");
              }}
            >
              Print Order
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
