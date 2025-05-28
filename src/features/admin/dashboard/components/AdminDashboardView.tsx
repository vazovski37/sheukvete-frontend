// src/features/admin/dashboard/components/AdminDashboardView.tsx
"use client";

import { useAdminDashboardStats } from "../hooks/useAdminDashboardStats";
import { DashboardStatCard } from "./DashboardStatCard";
import { DashboardChartCard } from "./DashboardChartCard";
import { LatestOrdersTable } from "./LatestOrdersTable";
import { DateRangePicker } from "@/features/admin/finances/components/DateRangePicker";
import { Separator } from "@/components/ui/separator";
import { Line, Bar } from "react-chartjs-2";
import { DollarSign, ShoppingCart, Layers, Users } from "lucide-react";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement, TimeScale, TimeSeriesScale
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement, TimeScale, TimeSeriesScale
);

export function AdminDashboardView() {
  const { stats, loadingStats, filter, setFilter } = useAdminDashboardStats();

  // Safely define chart data, using default empty arrays if data is not yet populated
  const salesOverTimeChartData = {
    labels: stats.salesOverTime?.labels || [],
    datasets: [
      {
        label: "Sales ($)",
        data: stats.salesOverTime?.data || [],
        borderColor: "hsl(var(--primary))",
        backgroundColor: `hsla(${typeof window !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue('--primary-hsl')?.trim() : '240 5.9% 10%'}, 0.2)`,
        tension: 0.2, borderWidth: 1.5, pointRadius: 2, pointHoverRadius: 4,
      },
    ],
  };
  
  const salesChartOptions = {
     responsive: true, maintainAspectRatio: false,
     scales: { x: { grid: { display: false } }, y: { grid: { color: "hsl(var(--border))" } } },
     plugins: { legend: { display: false } }
  };

  const topCategoriesChartData = {
    labels: stats.topCategories?.labels || [],
    datasets: [
      {
        label: "Sales",
        data: stats.topCategories?.data || [],
        backgroundColor: [
          "hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))",
          "hsl(var(--chart-4))", "hsl(var(--chart-5))",
        ],
        borderRadius: 4,
      },
    ],
  };
  const categoriesChartOptions = {
    responsive: true, maintainAspectRatio: false,
    scales: { x: { grid: { display: false } }, y: { grid: { color: "hsl(var(--border))" } } },
    plugins: { legend: { display: false } }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
      </div>
      <DateRangePicker
        initialStartDateString={filter.start}
        initialEndDateString={filter.end}
        onFilterSubmit={setFilter}
        isLoading={loadingStats}
      />
      <Separator className="my-6" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatCard title="Total Sales" value={`$${stats.totalSales.toFixed(2)}`} isLoading={loadingStats} icon={<DollarSign className="h-5 w-5 text-muted-foreground"/>} />
        <DashboardStatCard title="Total Orders" value={stats.totalOrders} isLoading={loadingStats} icon={<ShoppingCart className="h-5 w-5 text-muted-foreground"/>} />
        <DashboardStatCard title="Total Categories" value={stats.totalCategories} isLoading={loadingStats} icon={<Layers className="h-5 w-5 text-muted-foreground"/>} />
        <DashboardStatCard title="Total Waiters" value={stats.totalWaiters} isLoading={loadingStats} icon={<Users className="h-5 w-5 text-muted-foreground"/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardChartCard title="Sales Over Time" isLoading={loadingStats}>
          {(!loadingStats && stats.salesOverTime && stats.salesOverTime.labels.length > 0) ? (
            <Line options={salesChartOptions} data={salesOverTimeChartData} />
          ) : !loadingStats ? <p className="text-center text-muted-foreground p-4 h-full flex items-center justify-center">No sales data for this period.</p> : null }
        </DashboardChartCard>
        <DashboardChartCard title="Top Selling Categories" isLoading={loadingStats}>
           {(!loadingStats && stats.topCategories && stats.topCategories.labels.length > 0) ? (
            <Bar options={categoriesChartOptions} data={topCategoriesChartData} />
           ) : !loadingStats ? <p className="text-center text-muted-foreground p-4 h-full flex items-center justify-center">No category data for this period.</p> : null }
        </DashboardChartCard>
      </div>

      <LatestOrdersTable orders={stats.latestOrders || []} isLoading={loadingStats} />
    </div>
  );
}