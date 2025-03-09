"use client";

import { useEffect, useState } from "react";
import { useFinances } from "@/hooks/useFinances";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

export default function FinancesPage() {
  const { financeSummary, foodSales, loading, setFilter } = useFinances();
  const [start, setStart] = useState<Date | undefined>(undefined);
  const [end, setEnd] = useState<Date | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  // Ensure hydration sync
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFilterSubmit = () => {
    if (!start || !end) return;
    setFilter({ start: start.toISOString().split("T")[0], end: end.toISOString().split("T")[0] });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📊 Financial Reports</h1>

      {/* Ensure Calendars only render after hydration */}
      {mounted && (
        <div className="flex items-center gap-4">
          <div className="border rounded-md p-2">
            <Calendar 
              mode="single"
              selected={start} 
              onSelect={(date) => setStart(date ?? undefined)} 
            />
            <p className="text-sm text-muted-foreground mt-2">
              Start Date: {start ? start.toDateString() : "Not Selected"}
            </p>
          </div>
          
          <div className="border rounded-md p-2">
            <Calendar 
              mode="single"
              selected={end} 
              onSelect={(date) => setEnd(date ?? undefined)} 
            />
            <p className="text-sm text-muted-foreground mt-2">
              End Date: {end ? end.toDateString() : "Not Selected"}
            </p>
          </div>
          
          <Button onClick={handleFilterSubmit}>Filter</Button>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Sales by Waiter */}
          <Card>
            <CardHeader>
              <CardTitle>🧑‍🍳 Sales Summary by Waiter</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waiter Name</TableHead>
                    <TableHead>Total Sales ($)</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Payment Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {financeSummary.length > 0 ? (
                    financeSummary.map((summary, index) => (
                      <TableRow key={index}>
                        <TableCell>{summary.waiterName}</TableCell>
                        <TableCell>${summary.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>{summary.totalOrders}</TableCell>
                        <TableCell>{summary.paymentDate}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle>📈 Sales Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <Line
                data={{
                  labels: financeSummary.map((entry) => entry.paymentDate),
                  datasets: [
                    {
                      label: "Total Sales ($)",
                      data: financeSummary.map((entry) => entry.totalAmount),
                      borderColor: "#4F46E5",
                      backgroundColor: "rgba(79, 70, 229, 0.2)",
                      tension: 0.3,
                    },
                  ],
                }}
              />
            </CardContent>
          </Card>

          {/* Food Sales Report */}
          <Card>
            <CardHeader>
              <CardTitle>🍽️ Food Sales Report</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Food Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity Sold</TableHead>
                    <TableHead>Revenue ($)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {foodSales.length > 0 ? (
                    foodSales.map((sale) => (
                      <TableRow key={sale.foodId}>
                        <TableCell>{sale.foodName}</TableCell>
                        <TableCell>{sale.categoryName}</TableCell>
                        <TableCell>{sale.totalQuantity}</TableCell>
                        <TableCell>${sale.totalRevenue.toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
