// src/features/admin/finances/components/SalesOverTimeChart.tsx
"use client";

import { useMemo, useState } from "react"; // Added useState for color scheme
import type { FinanceSummary } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Import Button
import { Line } from "react-chartjs-2";
import { Skeleton } from "@/components/ui/skeleton";
import { Paintbrush } from "lucide-react"; // Icon for the button
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale,
  ChartOptions,
  ChartData
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, TimeSeriesScale
);

// Define color schemes
interface ChartColorScheme {
  name: string;
  primary: {
    border: string;
    background: string;
    point: string;
  };
  textMuted: string;
  gridBorder: string;
  textDefault: string;
}

const COLOR_SCHEMES: ChartColorScheme[] = [
  {
    name: "Blue (Default)",
    primary: {
      border: 'rgba(59, 130, 246, 1)',       // Tailwind blue-500
      background: 'rgba(59, 130, 246, 0.2)',
      point: 'rgba(59, 130, 246, 1)',
    },
    textMuted: 'rgba(100, 116, 139, 1)',   // slate-500
    gridBorder: 'rgba(226, 232, 240, 1)', // slate-200
    textDefault: 'rgba(15, 23, 42, 1)',     // slate-900
  },
  {
    name: "Green",
    primary: {
      border: 'rgba(16, 185, 129, 1)',       // Tailwind green-500
      background: 'rgba(16, 185, 129, 0.2)',
      point: 'rgba(16, 185, 129, 1)',
    },
    textMuted: 'rgba(100, 116, 139, 1)',
    gridBorder: 'rgba(226, 232, 240, 1)',
    textDefault: 'rgba(15, 23, 42, 1)',
  },
  {
    name: "Orange",
    primary: {
      border: 'rgba(249, 115, 22, 1)',      // Tailwind orange-500
      background: 'rgba(249, 115, 22, 0.2)',
      point: 'rgba(249, 115, 22, 1)',
    },
    textMuted: 'rgba(100, 116, 139, 1)',
    gridBorder: 'rgba(226, 232, 240, 1)',
    textDefault: 'rgba(15, 23, 42, 1)',
  },
    {
    name: "Purple",
    primary: {
      border: 'rgba(139, 92, 246, 1)',    // Tailwind violet-500
      background: 'rgba(139, 92, 246, 0.2)',
      point: 'rgba(139, 92, 246, 1)',
    },
    textMuted: 'rgba(100, 116, 139, 1)',
    gridBorder: 'rgba(226, 232, 240, 1)',
    textDefault: 'rgba(15, 23, 42, 1)',
  },
];


interface SalesOverTimeChartProps {
  data: FinanceSummary[];
  isLoading: boolean;
}

export function SalesOverTimeChart({ data, isLoading }: SalesOverTimeChartProps) {
  const [currentColorSchemeIndex, setCurrentColorSchemeIndex] = useState(0);

  const cycleColorScheme = () => {
    setCurrentColorSchemeIndex((prevIndex) => (prevIndex + 1) % COLOR_SCHEMES.length);
  };

  const currentColors = COLOR_SCHEMES[currentColorSchemeIndex];

  const memoizedChartData = useMemo((): ChartData<'line'> => {
    return {
      labels: data.map((entry) => entry.paymentDate).sort((a,b) => new Date(a).getTime() - new Date(b).getTime()),
      datasets: [
        {
          label: "Total Sales ($)",
          data: data.map((entry) => entry.totalAmount),
          borderColor: currentColors.primary.border,
          backgroundColor: currentColors.primary.background,
          tension: 0.1,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: currentColors.primary.point,
        },
      ],
    };
  }, [data, currentColors]); // Dependency on currentColors

  const memoizedChartOptions = useMemo((): ChartOptions<'line'> => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "time" as const,
          time: { unit: "day" as const, tooltipFormat: "MMM dd, yy", displayFormats: { day: "MMM dd" } },
          title: { display: true, text: "Date", color: currentColors.textMuted },
          grid: { display: false },
          ticks: { color: currentColors.textMuted },
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: "Sales ($)", color: currentColors.textMuted },
          grid: { color: currentColors.gridBorder },
          ticks: { color: currentColors.textMuted },
        },
      },
      plugins: {
        legend: { position: "top" as const, labels: { color: currentColors.textDefault } },
        tooltip: { mode: "index" as const, intersect: false },
      },
      // Animation can be disabled for smoother color transitions if Chart.js re-renders fully
      // animation: false,
    };
  }, [currentColors]); // Dependency on currentColors

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">📈 Sales Over Time</CardTitle>
            <Skeleton className="h-8 w-28" /> {/* Skeleton for button */}
        </CardHeader>
        <CardContent className="h-[300px] sm:h-[400px]"><Skeleton className="h-full w-full" /></CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">📈 Sales Over Time</CardTitle>
            <Button variant="outline" size="sm" disabled>
                <Paintbrush className="mr-2 h-4 w-4" /> Change Color
            </Button>
        </CardHeader>
        <CardContent className="h-[300px] sm:h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">No sales data to display for the chart.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">📈 Sales Over Time (by Waiter Payment Date)</CardTitle>
        <Button variant="outline" size="sm" onClick={cycleColorScheme}>
            <Paintbrush className="mr-2 h-4 w-4" /> Cycle Color ({currentColors.name})
        </Button>
      </CardHeader>
      <CardContent className="h-[300px] sm:h-[400px]">
        {/* Keying the Line component with currentColorSchemeIndex ensures it re-initializes if needed */}
        <Line key={currentColorSchemeIndex} options={memoizedChartOptions} data={memoizedChartData} />
      </CardContent>
    </Card>
  );
}