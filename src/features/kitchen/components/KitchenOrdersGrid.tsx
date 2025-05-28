// src/features/kitchen/components/KitchenOrdersGrid.tsx
'use client'

import { useKitchenOrders } from "../hooks/useKitchenOrders";
import { OrderCard } from "./OrderCard";

export function KitchenOrdersGrid() {
  const { orders, loading, error, refetch } = useKitchenOrders();

  if (loading) return <div className="p-4">Loading orders...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {orders.map((order) => (
        <OrderCard key={order.tableId} order={order} onStatusChange={refetch} />
      ))}
    </div>
  );
}
