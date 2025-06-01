// src/features/waiter/components/WaiterDashboardView.tsx
"use client";

import React, { useState, useMemo } from "react"; // useEffect removed as refetch functions are not exposed by the current hook
import { useRouter } from "next/navigation";
import { useWaiterOrderManagement } from "../hooks/useWaiterOrderManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { WaiterTableInfo } from "../types";
import {
  AlertTriangle,
  Edit3,
  Eye,
  CircleDollarSign,
  History,
  Truck,
  LogOut,
  UserCircle,
  Loader2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useUserStore } from "@/stores/userStore";
import { Badge } from "@/components/ui/badge";

interface TableCardProps {
  table: WaiterTableInfo;
  isOccupied: boolean;
  onViewOrder: (tableId: number) => void;
  onUpdateOrder: (tableId: number) => void;
  onPayOrder: (tableId: number) => void;
}

function TableCard({ table, isOccupied, onViewOrder, onUpdateOrder, onPayOrder }: TableCardProps) {
  return (
    <Card
      className={cn(
        "hover:shadow-lg transition-shadow cursor-pointer",
      )}
    >
      <CardHeader className="relative px-4 pt-4 pb-2">
        <Badge
          variant={isOccupied ? "destructive" : "success"}
          className="absolute top-2 right-2 text-xs px-2 py-[2px] rounded-md shadow"
        >
          {isOccupied ? "Occupied" : "Available"}
        </Badge>

        <div className="flex items-center justify-start gap-2">
          <span className="text-lg">🍽️</span>
          <CardTitle className="text-base font-semibold">Table {table.tableNumber}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col items-center space-y-3 p-4 pt-0">
        {isOccupied ? (
          <div className="grid grid-cols-1 gap-2 w-full">
            <Button variant="outline" size="sm" onClick={() => onViewOrder(table.id)} className="text-xs w-full">
              <Eye className="mr-1.5 h-3.5 w-3.5" /> View Order
            </Button>
            <Button size="sm" variant="secondary" onClick={() => onPayOrder(table.id)} className="text-xs w-full">
              <CircleDollarSign className="mr-1.5 h-3.5 w-3.5" /> Proceed to Pay
            </Button>
          </div>
        ) : (
          <Button size="sm" onClick={() => onUpdateOrder(table.id)} className="w-full text-xs">
            <Edit3 className="mr-1.5 h-3.5 w-3.5" /> Create Order
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function WaiterDashboardView() {
  const router = useRouter();
  // Destructuring based on the latest useWaiterOrderManagement.ts provided
  // which does not explicitly return refetchOccupiedTables or refetchTables
  const {
    tables,
    occupiedTables,
    isLoadingTables,
    isLoadingOccupiedTables,
  } = useWaiterOrderManagement();
  const [filter, setFilter] = useState<"ALL" | "AVAILABLE" | "OCCUPIED">("ALL");
  const { logout, isPending: isLoggingOut } = useLogout();
  const user = useUserStore((state) => state.user);

  // The explicit useEffect for refetching has been removed as the current
  // version of useWaiterOrderManagement.ts does not expose refetch functions.
  // The cache invalidation in the hook itself is the primary mechanism for data freshness.

  const isLoading = isLoadingTables || isLoadingOccupiedTables;

  const handleViewOrder = (tableId: number) => router.push(`/waiter/orders/view/${tableId}`);
  const handleUpdateOrder = (tableId: number) => router.push(`/waiter/orders/update/${tableId}`);
  const handlePayOrder = (tableId: number) => router.push(`/waiter/pay/${tableId}`);

  const occupiedTableIds = useMemo(() => new Set(occupiedTables.map((ot) => ot.id)), [occupiedTables]);

  const filteredTables = useMemo(() => {
    return tables
      .filter((table) => {
        const isOccupied = occupiedTableIds.has(table.id);
        if (filter === "AVAILABLE") return !isOccupied;
        if (filter === "OCCUPIED") return isOccupied;
        return true;
      })
      .sort((a, b) => a.tableNumber - b.tableNumber);
  }, [tables, occupiedTableIds, filter]);

  // Skeleton for initial loading state
  // This handles the case where data is loading and we don't have tables/occupiedTables yet.
  if (isLoading && tables.length === 0 && occupiedTables.length === 0) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="sm:col-span-2">
                <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-10 w-full sm:w-72 mb-4" />
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2 pt-4"><Skeleton className="h-6 w-20 mx-auto" /></CardHeader>
              <CardContent className="flex flex-col items-center space-y-3 p-4 pt-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-full mx-auto">
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {user?.role && <UserCircle className="h-7 w-7 text-primary" />}
          <h1 className="text-lg sm:text-2xl font-bold whitespace-nowrap">
            {user?.role
              ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()} Dashboard`
              : "🧑‍🍳 Waiter Dashboard"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={() => logout()} disabled={isLoggingOut}>
            <LogOut className="mr-2 h-4 w-4" /> {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-row-1 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <Card>
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-sm font-semibold">Total Tables</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold h-10 flex items-center pt-1">
              {/* Show loader if tables haven't loaded yet, otherwise show length */}
              {isLoadingTables && tables.length === 0 ? <Loader2 className="animate-spin size-6" /> : tables.length}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-sm font-semibold">Available Tables</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold h-10 flex items-center pt-1">
            {/* Show loader if either table source is loading and we don't have initial data */}
            {isLoading && tables.length === 0 ? <Loader2 className="animate-spin size-6" /> : tables.length - occupiedTables.length}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-sm font-semibold">Occupied Tables</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold h-10 flex items-center pt-1">
             {/* Show loader if occupiedTables haven't loaded (and tables might also be loading) */}
            {isLoadingOccupiedTables && occupiedTables.length === 0 && tables.length === 0 ? <Loader2 className="animate-spin size-6" /> : occupiedTables.length}
          </CardContent>
        </Card>
      </div>

      <Separator />

      <Tabs defaultValue="ALL" onValueChange={(v) => setFilter(v as typeof filter)} className="w-full">
        <TabsList className="flex flex-row flex-wrap w-full sm:w-auto sm:inline-flex mb-4 h-auto sm:h-10">
          <TabsTrigger value="ALL" className="text-xs sm:text-sm">All Tables</TabsTrigger>
          <TabsTrigger value="AVAILABLE" className="text-xs sm:text-sm">Available</TabsTrigger>
          <TabsTrigger value="OCCUPIED" className="text-xs sm:text-sm">Occupied</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-2">
          {isLoading && filteredTables.length === 0 && (tables.length > 0 || occupiedTables.length > 0) && !(tables.length === 0 && occupiedTables.length === 0) ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin size-6 text-muted-foreground" />
            </div>
          ) : !isLoading && tables.length === 0 ? (
            <div className="py-10 text-center space-y-3 col-span-full">
              <AlertTriangle className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No Tables Found</h3>
              <p className="text-sm text-muted-foreground">Please ask an administrator to add tables to the system.</p>
            </div>
          ) : filteredTables.length === 0 && filter !== "ALL" ? (
            <div className="py-10 text-center col-span-full">
              <p className="text-muted-foreground">No tables match the filter "{filter.toLowerCase()}".</p>
            </div>
          ) : (
            filteredTables.length > 0 ? (
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredTables.map((table) => (
                    <TableCard
                    key={table.id}
                    table={table}
                    isOccupied={occupiedTableIds.has(table.id)}
                    onViewOrder={handleViewOrder}
                    onUpdateOrder={handleUpdateOrder}
                    onPayOrder={handlePayOrder}
                    />
                ))}
                </div>
            ) : (
                 !isLoading && tables.length > 0 && filter === "ALL" &&
                 <div className="py-10 text-center col-span-full">
                     <p className="text-muted-foreground">No tables to display.</p>
                 </div>
            )
          )}
        </TabsContent>
      </Tabs>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6 border-t pt-6">
        <Button className="w-full sm:w-auto" onClick={() => router.push("/waiter/move-order")}>
          <Truck className="mr-2 h-4 w-4" /> Move Order
        </Button>
        <Button
          className="w-full sm:w-auto"
          variant="secondary"
          onClick={() => router.push("/waiter/orders/history")}
        >
          <History className="mr-2 h-4 w-4" /> View Orders History
        </Button>
      </div>
    </div>
  );
}