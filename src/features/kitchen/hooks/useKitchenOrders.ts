// src/features/kitchen/hooks/useKitchenOrders.ts
'use client'

import { useEffect, useState } from "react";
import { getKitchenOrders} from "../api";
import { KitchenOrder } from "../types";

export function useKitchenOrders() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getKitchenOrders();
      setOrders(data);
    } catch (err) {
      setError("Failed to load kitchen orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
  };
}
