import { useEffect, useState, useRef } from "react";
import { 
  fetchKitchenOrders, 
  toggleCookingStatus, 
  printKitchenOrder 
} from "@/services/kitchenService";
import { toast } from "sonner";

interface KitchenOrder {
  tableNumber: number;
  waiterName: string;
  orderTime: string;
  items: {
    orderItemId: number;
    foodName: string;
    quantity: number;
    comment: string;
  }[];
  cooking: boolean;
}

export function useKitchen() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const ordersRef = useRef<KitchenOrder[]>([]); // Stores the last fetched state to detect changes

  useEffect(() => {
    loadOrders();
    const interval = setInterval(() => {
      loadOrders(); // Periodically fetch new data
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const data = await fetchKitchenOrders();

      // Only update the state if there are actual changes
      if (JSON.stringify(data) !== JSON.stringify(ordersRef.current)) {
        setOrders(data);
        ordersRef.current = data; // Update reference to track new state
      }
    } catch (error) {
      console.error("Error fetching kitchen orders:", error);
      toast.error("Failed to fetch kitchen orders");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCookingStatus = async (tableId: number) => {
    try {
      await toggleCookingStatus(tableId);
      toast.success("Cooking status updated!");
      loadOrders();
    } catch {
      toast.error("Failed to update cooking status.");
    }
  };

  const handlePrintKitchenOrder = async (tableId: number, orderItemIds: number[]) => {
    try {
      await printKitchenOrder({ tableId, orderItemIds });
      toast.success("Order printed successfully!");
      loadOrders();
    } catch {
      toast.error("Failed to print kitchen order.");
    }
  };

  return {
    orders,
    loading,
    loadOrders,
    handleToggleCookingStatus,
    handlePrintKitchenOrder,
  };
}
