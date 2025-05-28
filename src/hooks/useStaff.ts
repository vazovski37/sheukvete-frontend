import { useEffect, useState } from "react";
import {
  resetUserPassword,
  editKitchenUser,
  changePosIp,
  changeKitchenIp,
  changeBarIp,
  changeAdditionPercentage,
  addKitchenUser,
  addAdmin,
  viewKitchenUsers,
  viewAllUsers,
  deleteKitchenUser,
  deleteAdmin,
} from "@/services/staffService";
import { toast } from "sonner";
import { UserS } from "@/types/user";

export function useStaff() {

  const [loading, setLoading] = useState(true);
  const [kitchenUsers, setKitchenUsers] = useState<UserS[]>([]);
  const [allUsers, setAllUsers] = useState<UserS[]>([]);

  useEffect(() => {
    setLoading(true);

    Promise.all([viewKitchenUsers(), viewAllUsers()])
      .then(([kitchenData, allUsersData]) => {
        setKitchenUsers(kitchenData);
        setAllUsers(allUsersData);
      })
      .catch((error) => {
        console.error("Error fetching staff data:", error);
        toast.error("Failed to fetch staff data");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleResetPassword = async (username: string, newPassword: string, confirmPassword: string) => {
    try {
      await resetUserPassword({ username, newPassword, confirmPassword });
      toast.success("Password reset successfully!");
    } catch {
      toast.error("Failed to reset password.");
    }
  };

  const handleEditKitchenUser = async (username: string) => {
    try {
      await editKitchenUser(username);
      toast.success("Kitchen user updated successfully!");
    } catch {
      toast.error("Failed to update kitchen user.");
    }
  };

  const handleChangePosIp = async (ip: string) => {
    try {
      await changePosIp(ip);
      toast.success("POS IP updated successfully!");
    } catch {
      toast.error("Failed to update POS IP.");
    }
  };

  const handleChangeKitchenIp = async (ip: string) => {
    try {
      await changeKitchenIp(ip);
      toast.success("Kitchen printer IP updated successfully!");
    } catch {
      toast.error("Failed to update kitchen printer IP.");
    }
  };

  const handleChangeBarIp = async (ip: string) => {
    try {
      await changeBarIp(ip);
      toast.success("Bar printer IP updated successfully!");
    } catch {
      toast.error("Failed to update bar printer IP.");
    }
  };

  const handleChangeAdditionPercentage = async (percentage: string) => {
    try {
      await changeAdditionPercentage(percentage);
      toast.success("Addition percentage updated successfully!");
    } catch {
      toast.error("Failed to update addition percentage.");
    }
  };

  const handleAddKitchenUser = async () => {
    try {
      await addKitchenUser();
      toast.success("Kitchen user added successfully!");
    } catch {
      toast.error("Failed to add kitchen user.");
    }
  };

  const handleAddAdmin = async () => {
    try {
      await addAdmin();
      toast.success("Admin added successfully!");
    } catch {
      toast.error("Failed to add admin.");
    }
  };

  const handleDeleteKitchenUser = async () => {
    try {
      await deleteKitchenUser();
      toast.success("Kitchen user deleted successfully!");
    } catch {
      toast.error("Failed to delete kitchen user.");
    }
  };

  const handleDeleteAdmin = async () => {
    try {
      await deleteAdmin();
      toast.success("Admin deleted successfully!");
    } catch {
      toast.error("Failed to delete admin.");
    }
  };

  return {
    kitchenUsers,
    allUsers,
    loading,
    handleResetPassword,
    handleEditKitchenUser,
    handleChangePosIp,
    handleChangeKitchenIp,
    handleChangeBarIp,
    handleChangeAdditionPercentage,
    handleAddKitchenUser,
    handleAddAdmin,
    handleDeleteKitchenUser,
    handleDeleteAdmin,
  };
}
