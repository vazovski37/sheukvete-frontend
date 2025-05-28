'use client'

import { KitchenOrdersGrid } from "@/features/kitchen/components/KitchenOrdersGrid";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useLogout } from "@/features/auth/hooks/useLogout";

export default function KitchenPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { logout, isPending } = useLogout();

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-muted/50">
      <header className="flex items-center justify-between p-6 border-b">
        <div>
          <h1 className="text-2xl font-semibold">Kitchen Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {currentTime.toLocaleTimeString()}
          </p>
        </div>
        <Button variant="outline" onClick={() => logout()} disabled={isPending}>
          Logout
        </Button>
      </header>

      <KitchenOrdersGrid />
    </main>
  );
}
