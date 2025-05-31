// src/features/staff/hooks/useStaffManagement.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  resetUserPasswordStaff,
  editKitchenUserStaff,
  changePosIpStaff,
  changeKitchenIpStaff,
  changeBarIpStaff,
  changeAdditionPercentageStaff,
  addKitchenUserStaff,
  addAdminUserStaff, // Assuming you renamed addAdmin to addAdminUserStaff in api.ts
  viewKitchenUsersStaff,
  viewAllUsersStaff,
  deleteKitchenUserStaff,
  deleteAdminUserStaff, // Assuming you renamed deleteAdmin to deleteAdminUserStaff in api.ts
} from "../api"; // This will point to src/features/staff/api.ts
import type { UserS } from "@/types/user"; // Assuming this type is appropriate for staff user listings

// Define query keys for staff-related data
const STAFF_QUERY_KEYS = {
  kitchenUsers: ["staff", "kitchenUsers"],
  allUsers: ["staff", "allUsers"],
};

// Define request interfaces used by mutations (can also be in ../types.ts)
interface ResetPasswordStaffRequest {
  username: string;
  newPassword: string;
  confirmPassword: string;
}
// Add other request/payload types if needed by addKitchenUserStaff, addAdminUserStaff, etc.

export function useStaffManagement() {
  const queryClient = useQueryClient();

  // Fetch kitchen users
  const { data: kitchenUsers = [], isLoading: isLoadingKitchenUsers, isError: isErrorKitchenUsers } = useQuery<UserS[], Error>({
    queryKey: STAFF_QUERY_KEYS.kitchenUsers,
    queryFn: viewKitchenUsersStaff,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Fetch all users
  const { data: allUsers = [], isLoading: isLoadingAllUsers, isError: isErrorAllUsers } = useQuery<UserS[], Error>({
    queryKey: STAFF_QUERY_KEYS.allUsers,
    queryFn: viewAllUsersStaff,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
  
  const overallLoading = isLoadingKitchenUsers || isLoadingAllUsers;

  // --- Mutations ---

  const useStaffMutation = <TData = void, TError = Error, TVariables = void>(
    mutationFn: (vars: TVariables) => Promise<TData>,
    successMessage: string,
    errorMessage: string,
    invalidateKeys: (string[] | { queryKey: string[] })[] = [] // Array of query keys to invalidate
  ) => {
    return useMutation<TData, TError, TVariables>({
      mutationFn,
      onSuccess: () => {
        toast.success(successMessage);
        invalidateKeys.forEach(keyOrObj => {
          if (Array.isArray(keyOrObj)) {
            queryClient.invalidateQueries({ queryKey: keyOrObj });
          } else {
            queryClient.invalidateQueries(keyOrObj);
          }
        });
      },
      onError: (error: TError) => {
        toast.error(`${errorMessage}: ${(error as Error).message || "Unknown error"}`);
      },
    });
  };

  const resetPasswordMutation = useStaffMutation<void, Error, ResetPasswordStaffRequest>(
    resetUserPasswordStaff,
    "Password reset successfully!",
    "Failed to reset password."
    // No specific query invalidation needed unless it affects user lists shown
  );

  const editKitchenUserMutation = useStaffMutation<void, Error, string>( // Assuming username is the variable
    (username) => editKitchenUserStaff(username),
    "Kitchen user updated successfully!",
    "Failed to update kitchen user.",
    [STAFF_QUERY_KEYS.kitchenUsers, STAFF_QUERY_KEYS.allUsers]
  );

  const changePosIpMutation = useStaffMutation<void, Error, string>(
    changePosIpStaff, "POS IP updated successfully!", "Failed to update POS IP."
  );
  const changeKitchenIpMutation = useStaffMutation<void, Error, string>(
    changeKitchenIpStaff, "Kitchen printer IP updated!", "Failed to update Kitchen printer IP."
  );
  const changeBarIpMutation = useStaffMutation<void, Error, string>(
    changeBarIpStaff, "Bar printer IP updated!", "Failed to update Bar printer IP."
  );
  const changeAdditionPercentageMutation = useStaffMutation<void, Error, string>(
    changeAdditionPercentageStaff, "Addition percentage updated!", "Failed to update addition percentage."
  );

  const addKitchenUserMutation = useStaffMutation<void, Error, any>( // Replace 'any' with actual payload type if defined
    (payload) => addKitchenUserStaff(payload),
    "Kitchen user added successfully!",
    "Failed to add kitchen user.",
    [STAFF_QUERY_KEYS.kitchenUsers, STAFF_QUERY_KEYS.allUsers]
  );

  const addAdminMutation = useStaffMutation<void, Error, any>( // Replace 'any' with actual payload type if defined
    (payload) => addAdminUserStaff(payload),
    "Admin added successfully!",
    "Failed to add admin.",
    [STAFF_QUERY_KEYS.allUsers]
  );
  
  // For delete mutations, you might pass an ID or username
  const deleteKitchenUserMutation = useStaffMutation<void, Error, string | undefined>( // Assuming optional username for deletion
    (username) => deleteKitchenUserStaff(username),
    "Kitchen user deleted successfully!",
    "Failed to delete kitchen user.",
    [STAFF_QUERY_KEYS.kitchenUsers, STAFF_QUERY_KEYS.allUsers]
  );

  const deleteAdminMutation = useStaffMutation<void, Error, string | undefined>( // Assuming optional username
    (username) => deleteAdminUserStaff(username),
    "Admin deleted successfully!",
    "Failed to delete admin.",
    [STAFF_QUERY_KEYS.allUsers]
  );


  return {
    kitchenUsers,
    allUsers,
    loading: overallLoading,
    isErrorKitchenUsers,
    isErrorAllUsers,

    // Expose mutateAsync functions or the full mutation objects as needed
    resetPassword: resetPasswordMutation.mutateAsync,
    isResettingPassword: resetPasswordMutation.isPending,

    editKitchenUser: editKitchenUserMutation.mutateAsync,
    isEditingKitchenUser: editKitchenUserMutation.isPending,
    
    changePosIp: changePosIpMutation.mutateAsync,
    isChangingPosIp: changePosIpMutation.isPending,

    changeKitchenIp: changeKitchenIpMutation.mutateAsync,
    isChangingKitchenIp: changeKitchenIpMutation.isPending,

    changeBarIp: changeBarIpMutation.mutateAsync,
    isChangingBarIp: changeBarIpMutation.isPending,

    changeAdditionPercentage: changeAdditionPercentageMutation.mutateAsync,
    isChangingAdditionPercentage: changeAdditionPercentageMutation.isPending,

    addKitchenUser: addKitchenUserMutation.mutateAsync,
    isAddingKitchenUser: addKitchenUserMutation.isPending,

    addAdmin: addAdminMutation.mutateAsync,
    isAddingAdmin: addAdminMutation.isPending,

    deleteKitchenUser: deleteKitchenUserMutation.mutateAsync,
    isDeletingKitchenUser: deleteKitchenUserMutation.isPending,

    deleteAdmin: deleteAdminMutation.mutateAsync,
    isDeletingAdmin: deleteAdminMutation.isPending,
    
    // Function to refetch user lists manually if needed
    refetchUsers: () => {
        queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEYS.kitchenUsers });
        queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEYS.allUsers });
    }
  };
}