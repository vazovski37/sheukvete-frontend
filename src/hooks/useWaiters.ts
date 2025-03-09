import { useEffect, useState } from "react";
import { fetchWaiters, addWaiter, editWaiter, deleteWaiter } from "@/services/waiterService";
import { Waiter, AddWaiterRequest, EditWaiterRequest } from "@/types/waiter";
import { toast } from "sonner";

export function useWaiters() {
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchWaiters()
      .then((data) => setWaiters(data))
      .catch(() => {
        toast.error("Failed to fetch waiters");
        setWaiters([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddWaiter = async (waiter: AddWaiterRequest) => {
    try {
      await addWaiter(waiter);
      toast.success("Waiter added successfully!");
      setWaiters((prev) => [...prev, { id: Date.now(), username: waiter.username, role: "staff", active: true }]);
    } catch {
      toast.error("Failed to add waiter.");
    }
  };

  const handleEditWaiter = async (id: number, waiter: EditWaiterRequest) => {
    try {
      await editWaiter(id, waiter);
      toast.success("Waiter updated successfully!");
      setWaiters((prev) => prev.map((w) => (w.id === id ? { ...w, username: waiter.username } : w)));
    } catch {
      toast.error("Failed to update waiter.");
    }
  };

  const handleDeleteWaiter = async (id: number) => {
    try {
      await deleteWaiter(id);
      toast.success("Waiter deleted successfully!");
      setWaiters((prev) => prev.filter((w) => w.id !== id));
    } catch {
      toast.error("Failed to delete waiter.");
    }
  };

  return { waiters, loading, handleAddWaiter, handleEditWaiter, handleDeleteWaiter };
}

