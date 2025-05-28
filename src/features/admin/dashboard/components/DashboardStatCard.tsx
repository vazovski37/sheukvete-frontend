// src/features/admin/dashboard/components/DashboardStatCard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  isLoading?: boolean;
  icon?: React.ReactNode; // Optional icon
}

export function DashboardStatCard({ title, value, isLoading, icon }: DashboardStatCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium"><Skeleton className="h-5 w-24" /></CardTitle>
          {icon && <Skeleton className="h-6 w-6" />}
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {/* You can add a sub-text here if needed, e.g., percentage change */}
        {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
      </CardContent>
    </Card>
  );
}