"use client";

import { useOrdersManagement } from "@/hooks/useOrdersManagement";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useLogin } from "@/hooks/useLogin";
import { ThemeToggle } from "@/components/theme-toggle";

export default function WaiterDashboard() {
  const { tables, occupiedTables, loading } = useOrdersManagement();
  const router = useRouter();
  const [filter, setFilter] = useState<"ALL" | "AVAILABLE" | "OCCUPIED">("ALL");
  const { logout } = useLogin();
  // Filter logic for tables
  const filteredTables = tables.filter((table) => {
    if (filter === "AVAILABLE") return !occupiedTables.some((t) => t.id === table.id);
    if (filter === "OCCUPIED") return occupiedTables.some((t) => t.id === table.id);
    return true; // "ALL" - return everything
  });

  return (
    <div className="p-6">
      <div className="flex flex-row justify-between">
      <h1 className="text-3xl font-bold mb-6">Waiter Dashboard</h1>
      <div className="flex space-x-4">
      <ThemeToggle></ThemeToggle>
      <Button onClick={logout} > logout </Button>
      </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>📌 Total Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{loading ? <Loader2 className="animate-spin" /> : tables.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🍽️ Occupied Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{loading ? <Loader2 className="animate-spin" /> : occupiedTables.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📝 Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{loading ? <Loader2 className="animate-spin" /> : occupiedTables.length}</p>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-4" />

      {/* Tabs for Table Filters */}
      <Tabs defaultValue="ALL" onValueChange={(value) => setFilter(value as "ALL" | "AVAILABLE" | "OCCUPIED")}>
        <TabsList className="mb-4 flex gap-4">
          <TabsTrigger value="ALL">All Tables</TabsTrigger>
          <TabsTrigger value="AVAILABLE">Available Tables</TabsTrigger>
          <TabsTrigger value="OCCUPIED">Occupied Tables</TabsTrigger>
        </TabsList>

        <TabsContent value={filter}>
          {loading ? (
            <div className="flex justify-center my-6">
              <Loader2 className="animate-spin size-8" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredTables.map((table) => {
                const isOccupied = occupiedTables.some((t) => t.id === table.id);
                return (
                  <Card key={table.id} className="p-4 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg">Table {table.tableNumber}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className={`text-lg font-semibold ${isOccupied ? "text-red-500" : "text-green-500"}`}>
                        {isOccupied ? "Occupied" : "Available"}
                      </p>

                      <div className="mt-4 flex flex-col gap-2">
                        {isOccupied ? (
                          <>
                            <Button
                              variant="outline"
                              onClick={() => router.push(`/waiter/orders/${table.id}`)}
                            >
                              View Order
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => router.push(`/waiter/pay/${table.id}`)}
                            >
                              Pay & Close Order
                            </Button>
                          </>
                        ) : (
                          <Button onClick={() => router.push(`/waiter/orders/${table.id}`)}>
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

      <div className="mt-6 flex justify-between">
        <Button onClick={() => router.push("/waiter/move-order")}>Move Order</Button>
        <Button variant="secondary" onClick={() => router.push("/waiter/orders")}>View All Orders</Button>
      </div>
    </div>
  );
}
