import { useState, useEffect } from "react";
import {
  fetchTables,
  fetchOccupiedTables,
  fetchOrderByTable,
  updateOrder,
  payFullOrder,
  payPartialOrder, // ✅ Import partial payment function
  moveOrder,
} from "@/services/waiterService";
import { Order, OrderItem, OrderRequestItem } from "@/types/order";
import { toast } from "sonner";
import { Table } from "@/types/table";
import { MoveOrderRequest, PartialPaymentRequest } from "@/types/waiter"; // ✅ Import PartialPaymentRequest

export function useOrdersManagement() {
  const [tables, setTables] = useState<Table[]>([]);
  const [occupiedTables, setOccupiedTables] = useState<Table[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadTables() {
      try {
        setLoading(true);
        const allTables = await fetchTables();
        const activeTables = await fetchOccupiedTables();
        setTables(allTables);
        setOccupiedTables(activeTables);
      } catch (error) {
        toast.error("Failed to load tables");
      } finally {
        setLoading(false);
      }
    }
    loadTables();
  }, []);

  // ✅ Load a specific order for a table
  const loadOrder = async (tableId: number): Promise<Order | null> => {
    try {
      const orderData = await fetchOrderByTable(tableId);
      setOrder(orderData);
      return orderData; // ✅ Ensure the function returns data
    } catch {
      toast.error("Failed to fetch order");
      return null;
    }
  };

  const handleUpdateOrder = async (tableId: number, items: OrderRequestItem[]) => {
    try {
      await updateOrder(tableId, items); // ✅ Now correctly formatted
      toast.success("Order updated successfully!");
      loadOrder(tableId);
    } catch {
      toast.error("Failed to update order.");
    }
  };
  


  // ✅ Full order payment
  const handlepayFullOrder = async (tableId: number) => {
    try {
      await payFullOrder(tableId);
      toast.success("Order paid successfully!");
      setOrder(null);
    } catch {
      toast.error("Failed to delete order.");
    }
  };

  // ✅ Partial order payment
  const handlepayPartialOrder = async (tableId: number, items: PartialPaymentRequest[]) => {
    try {
      await payPartialOrder(tableId, items);
      toast.success("Partial payment completed!");
      loadOrder(tableId); // ✅ Reload order after partial payment
    } catch {
      toast.error("Failed to process partial payment.");
    }
  };

  // ✅ Move an order to another table
  const handleMoveOrder = async (request: MoveOrderRequest) => {
    try {
      await moveOrder(request);
      toast.success("Order moved successfully!");
      setOccupiedTables(await fetchOccupiedTables()); // Refresh occupied tables after move
    } catch {
      toast.error("Failed to move order.");
    }
  };

  const handleDeleteOrder = async (tableId: number) => {
    try {
      const response = await fetch(`/api/orders/${tableId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete order");
      }
  
      toast.success("Order deleted successfully!");
      setOrder(null); // Clear the order after deletion
    } catch (error) {
      toast.error("Failed to delete order.");
      console.error("Delete order error:", error);
    }
  };
  

  return {
    tables,
    occupiedTables,
    order,
    loading,
    loadOrder,
    handleUpdateOrder,
    handlepayFullOrder,
    handlepayPartialOrder, // ✅ Now included
    handleMoveOrder,
    handleDeleteOrder
  };
}
