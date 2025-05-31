// src/app/waiter/orders/update/[tableId]/page.tsx
"use client";

import { OrderEditor } from "@/features/waiter/components/OrderEditor";

// This page component primarily serves to extract the tableId and render the editor.
// The OrderEditor component itself handles fetching initial order data if the tableId is valid.
export default function UpdateOrderPage() {
  return <OrderEditor />;
}