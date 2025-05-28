// src/features/admin/dashboard/components/DashboardChartCard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardChartCardProps {
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string; // Allow passing additional class names
}

export function DashboardChartCard({ title, children, isLoading, className }: DashboardChartCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
            {isLoading ? <Skeleton className="h-6 w-3/4" /> : title}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] sm:h-[350px] pb-4"> {/* Ensure content area has defined height */}
        {isLoading ? <Skeleton className="h-full w-full" /> : <div className="relative h-full w-full">{children}</div>}
      </CardContent>
    </Card>
  );
}