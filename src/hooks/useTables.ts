import { useEffect, useState } from "react";
import { fetchTables, addTable, editTable, deleteTable } from "@/services/tableService";
import { Table, AddTableRequest, EditTableRequest } from "@/types/table";
import { toast } from "sonner";

export function useTables() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchTables()
      .then((data) => setTables(data))
      .catch(() => {
        toast.error("Failed to fetch tables");
        setTables([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddTable = async (table: AddTableRequest) => {
    try {
      await addTable(table);
      toast.success("Table added successfully!");
      setTables((prev) => [...prev, { id: Date.now(), tableNumber: table.tableNumber }]);
    } catch {
      toast.error("Failed to add table.");
    }
  };

  const handleEditTable = async (id: number, table: EditTableRequest) => {
    try {
      await editTable(id, table);
      toast.success("Table updated successfully!");
      setTables((prev) => prev.map((t) => (t.id === id ? { ...t, tableNumber: table.tableNumber } : t)));
    } catch {
      toast.error("Failed to update table.");
    }
  };

  const handleDeleteTable = async (id: number) => {
    try {
      await deleteTable(id);
      toast.success("Table deleted successfully!");
      setTables((prev) => prev.filter((t) => t.id !== id));
    } catch {
      toast.error("Failed to delete table.");
    }
  };

  return { tables, loading, handleAddTable, handleEditTable, handleDeleteTable };
}
