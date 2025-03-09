"use client";

import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Line, Bar } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Skeleton } from "@/components/ui/skeleton";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

export default function AdminDashboard() {
  const { stats, loading } = useDashboardStats();

  return (
    <div className="p-6 space-y-6 w-full ">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)
        ) : (
          <>
            <DashboardCard title="Total Sales" value={`$${stats?.totalSales.toFixed(2)}`} />
            <DashboardCard title="Total Orders" value={stats?.totalOrders ?? 0} />
            <DashboardCard title="Total Categories" value={stats?.totalCategories ?? 0} />
            <DashboardCard title="Total Waiters" value={stats?.totalWaiters ?? 0} />
          </>
        )}
      </div>

      <Separator />

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Sales Over Time">
          {loading || !stats ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <Line
              data={{
                labels: stats.salesOverTime.labels,
                datasets: [
                  {
                    label: "Sales ($)",
                    data: stats.salesOverTime.data,
                    borderColor: "#4F46E5",
                    backgroundColor: "rgba(79, 70, 229, 0.2)",
                    tension: 0.3,
                  },
                ],
              }}
            />
          )}
        </ChartCard>

        <ChartCard title="Top Selling Categories">
          {loading || !stats ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <Bar
              data={{
                labels: stats.topCategories.labels,
                datasets: [
                  {
                    label: "Sales",
                    data: stats.topCategories.data,
                    backgroundColor: ["#F87171", "#60A5FA", "#34D399", "#FBBF24"],
                  },
                ],
              }}
            />
          )}
        </ChartCard>
      </div>

      <Separator />

      {/* Latest Orders Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-3">Latest Orders</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading || !stats
              ? [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={4}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              : stats.latestOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          order.status === "Completed"
                            ? "bg-green-500 text-white"
                            : "bg-yellow-500 text-white"
                        }`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Reusable Dashboard Card Component
function DashboardCard({ title, value }: { title: string; value: string | number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

// Reusable Chart Card Component
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
