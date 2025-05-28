"use client";

import { useOrdersManagement } from "@/hooks/useOrdersManagement";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLogout } from "@/features/auth/hooks/useLogout";

export default function WaiterDashboard() {
  const { tables, occupiedTables, loading } = useOrdersManagement();
  const router = useRouter();
  const [filter, setFilter] = useState<"ALL" | "AVAILABLE" | "OCCUPIED">("ALL");
  const { logout, isPending } = useLogout();

  const filteredTables = tables.filter((table) => {
    if (filter === "AVAILABLE") return !occupiedTables.some((t) => t.id === table.id);
    if (filter === "OCCUPIED") return occupiedTables.some((t) => t.id === table.id);
    return true;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
        <h1 className="text-base sm:text-2xl font-bold whitespace-nowrap">🧑‍🍳 Waiter Dashboard</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button onClick={() => logout()} disabled={isPending}>
            Logout
          </Button>
        </div>
      </div>



<div className="grid grid-cols-2 gap-4">
  {/* First card spans two columns always */}
  <div className="col-span-2">
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Total Tables</CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-bold h-10 flex items-center">
        {loading ? <Loader2 className="animate-spin size-6" /> : tables.length}
      </CardContent>
    </Card>
  </div>

  {/* Second Card */}
  <Card>
    <CardHeader>
      <CardTitle className="text-sm font-semibold">Occupied Tables</CardTitle>
    </CardHeader>
    <CardContent className="text-2xl font-bold h-10 flex items-center">
      {loading ? <Loader2 className="animate-spin size-6" /> : occupiedTables.length}
    </CardContent>
  </Card>

  {/* Third Card */}
  <Card>
    <CardHeader>
      <CardTitle className="text-sm font-semibold">Active Orders</CardTitle>
    </CardHeader>
    <CardContent className="text-2xl font-bold h-10 flex items-center">
      {loading ? <Loader2 className="animate-spin size-6" /> : occupiedTables.length}
    </CardContent>
  </Card>
</div>




      <Separator />

      {/* Table Filters */}
      <Tabs defaultValue="ALL" onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList className="flex w-full sm:w-auto gap-2 overflow-x-auto">
          <TabsTrigger value="ALL">All Tables</TabsTrigger>
          <TabsTrigger value="AVAILABLE">Available</TabsTrigger>
          <TabsTrigger value="OCCUPIED">Occupied</TabsTrigger>
        </TabsList>

        <TabsContent value={filter}>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin size-6" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
              {filteredTables.map((table) => {
                const isOccupied = occupiedTables.some((t) => t.id === table.id);
                return (
                  <Card key={table.id} className="p-4 space-y-3">
                    <CardHeader className="p-0">
                      <CardTitle className="text-base font-medium">
                        🍽 Table #{table.tableNumber}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 p-0">
                      <p
                        className={`text-sm font-semibold ${
                          isOccupied ? "text-red-500" : "text-green-600"
                        }`}
                      >
                        {isOccupied ? "Occupied" : "Available"}
                      </p>
                      <div className="flex flex-col gap-2">
                        {isOccupied ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => router.push(`/waiter/orders/view/${table.id}`)}
                            >
                              View Order
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => router.push(`/waiter/orders/update/${table.id}`)}
                            >
                              Add Items
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => router.push(`/waiter/orders/update/${table.id}`)}
                          >
                            Start Order
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
        <Button className="w-full sm:w-auto" onClick={() => router.push("/waiter/move-order")}>
          🔀 Move Order
        </Button>
        <Button
          className="w-full sm:w-auto"
          variant="secondary"
          onClick={() => router.push("/waiter/orders/history")}
        >
          📜 View All Orders
        </Button>
      </div>
    </div>
  );
}
