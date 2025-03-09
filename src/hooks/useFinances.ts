// hooks/useFinances.ts
import { useState, useEffect } from "react";
import { fetchFinanceSummary, fetchFoodSales } from "@/services/financeService";
import { FinanceSummary, FoodSale, FinanceFilter } from "@/types/finance";

export function useFinances() {
  const [financeSummary, setFinanceSummary] = useState<FinanceSummary[]>([]);
  const [foodSales, setFoodSales] = useState<FoodSale[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<FinanceFilter>({ start: "", end: "" });

  useEffect(() => {
    async function loadFinances() {
      if (!filter.start || !filter.end) return;
      setLoading(true);
      try {
        const [summary, sales] = await Promise.all([
          fetchFinanceSummary(filter.start, filter.end),
          fetchFoodSales(filter.start, filter.end),
        ]);
        setFinanceSummary(summary);
        setFoodSales(sales);
      } catch (error) {
        console.error("Failed to fetch finance data", error);
      } finally {
        setLoading(false);
      }
    }
    loadFinances();
  }, [filter]);

  return { financeSummary, foodSales, loading, setFilter };
}
