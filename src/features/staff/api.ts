// src/features/staff/api.ts

import { apiGet, apiPost, apiPut, apiDelete } from "@/utils/axiosInstance";
import API_ROUTES from "@/constants/apiRoutes";
import type { UserS } from "@/types/user"; // Make sure this type is suitable

// Define request interfaces (can be moved to a types.ts file within this feature)
interface ResetPasswordStaffRequest {
  username: string;
  newPassword: string;
  confirmPassword: string;
}

// If addKitchenUserStaff or addAdminUserStaff require specific payloads, define them here
// interface AddKitchenUserPayload { /* ... fields ... */ }
// interface AddAdminUserPayload { /* ... fields ... */ }


export const resetUserPasswordStaff = async (data: ResetPasswordStaffRequest): Promise<void> => {
  return apiPut(API_ROUTES.STAFF.RESET_USER_PASSWORD, data);
};

export const editKitchenUserStaff = async (username: string): Promise<void> => {
  // The original service sent { username } in the body for editing.
  // Adjust if your backend expects username as a path param or different body.
  return apiPut(API_ROUTES.STAFF.EDIT_KITCHEN_USER, { username });
};

export const changePosIpStaff = async (ip: string): Promise<void> => {
  // The original service appended ip as a query parameter. apiPut in your axiosInstance might need adjustment
  // or you construct the URL here. Assuming apiPut can handle query params in the URL directly.
  return apiPut(`${API_ROUTES.STAFF.CHANGE_POS_IP}?ip=${ip}`);
};

export const changeKitchenIpStaff = async (ip: string): Promise<void> => {
  return apiPut(`${API_ROUTES.STAFF.CHANGE_KITCHEN_IP}?ip=${ip}`);
};

export const changeBarIpStaff = async (ip: string): Promise<void> => {
  return apiPut(`${API_ROUTES.STAFF.CHANGE_BAR_IP}?ip=${ip}`);
};

export const changeAdditionPercentageStaff = async (percentage: string): Promise<void> => {
  return apiPut(`${API_ROUTES.STAFF.CHANGE_ADDITION_PERCENTAGE}?percentage=${percentage}`);
};

// If your backend doesn't need a payload for addKitchenUser or addAdmin,
// you can make the payload parameter optional or expect an empty object.
export const addKitchenUserStaff = async (payload?: any): Promise<void> => { // Or specific payload type
  return apiPost(API_ROUTES.STAFF.ADD_KITCHEN_USER, payload);
};

export const addAdminUserStaff = async (payload?: any): Promise<void> => { // Or specific payload type
  return apiPost(API_ROUTES.STAFF.ADD_ADMIN_USER, payload);
};

export const viewKitchenUsersStaff = async (): Promise<UserS[]> => {
  const response = await apiGet<UserS[]>(API_ROUTES.STAFF.VIEW_KITCHEN_USERS);
  return response || []; // apiGet returns data directly, ensure it's an array
};

export const viewAllUsersStaff = async (): Promise<UserS[]> => {
  const response = await apiGet<UserS[]>(API_ROUTES.STAFF.VIEW_ALL_USERS);
  return response || []; // apiGet returns data directly, ensure it's an array
};

// If your backend expects an identifier (like username) for deletion, adjust the signature
export const deleteKitchenUserStaff = async (username?: string): Promise<void> => {
  // Modify API_ROUTES.STAFF.DELETE_KITCHEN_USER if it needs an ID/username in the path
  // or pass username in the body if required.
  // Example: return apiDelete(API_ROUTES.STAFF.DELETE_KITCHEN_USER(username)); if it's a path param
  return apiDelete(API_ROUTES.STAFF.DELETE_KITCHEN_USER); // Assuming no param needed based on original hook
};

export const deleteAdminUserStaff = async (username?: string): Promise<void> => {
  return apiDelete(API_ROUTES.STAFF.DELETE_ADMIN_USER); // Assuming no param needed
};