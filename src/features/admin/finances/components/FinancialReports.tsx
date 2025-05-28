// src/features/admin/finances/components/FinancialReports.tsx
"use client";

import { useAdminFinances } from "../hooks/useAdminFinances";
import { DateRangePicker } from "./DateRangePicker";
import { FinanceSummaryTable } from "./FinanceSummaryTable";
import { SalesOverTimeChart } from "./SalesOverTimeChart";
import { FoodSalesTable } from "./FoodSalesTable";
import { Skeleton } from "@/components/ui/skeleton";

export function FinancialReports() {
  const { financeSummary, foodSales, loading, filter, setFilter } = useAdminFinances();

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold">💰 Financial Reports</h1>

      <DateRangePicker
        initialStartDateString={filter.start}
        initialEndDateString={filter.end}
        onFilterSubmit={setFilter}
        isLoading={loading}
      />

      {/* Display sections or skeletons based on overall loading state */}
      {/* <FinanceSummaryTable data={financeSummary} isLoading={loading} />
      <SalesOverTimeChart data={financeSummary} isLoading={loading} />
      <FoodSalesTable data={foodSales} isLoading={loading} /> */}

      {/* Alternative explicit loading state for entire content below date picker */}
      {loading ? (
        <div className="space-y-6 mt-6">
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      ) : (
        <div className="space-y-6 mt-6">
          <FinanceSummaryTable data={financeSummary} isLoading={false} />
          <SalesOverTimeChart data={financeSummary} isLoading={false} />
          <FoodSalesTable data={foodSales} isLoading={false} />
        </div>
      )}
    </div>
  );
}