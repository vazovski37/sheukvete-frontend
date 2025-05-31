// src/app/waiter/page.tsx
"use client";

import { WaiterDashboardView } from "@/features/waiter/components/WaiterDashboardView";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function WaiterPage() {
  // const user = useUserStore((state) => state.user); // Optional: Get user for welcome message
  // const router = useRouter();

  // useEffect(() => {
  //   if (!user || user.role !== 'WAITER') {
  //     router.replace('/login'); // Or some other appropriate page
  //   }
  // }, [user, router]);

  // if (!user || user.role !== 'WAITER') {
  //   return <div className="p-4">Redirecting...</div>; // Or a loading spinner
  // }

  return <WaiterDashboardView />;
}