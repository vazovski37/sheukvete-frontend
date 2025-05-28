import { apiClient } from "@/lib/axios";
import { apiPut } from "@/utils/axiosInstance";

interface ResetPasswordRequest {
  username: string;
  newPassword: string;
  confirmPassword: string;
}

export const resetUserPassword = async (data: ResetPasswordRequest) => {
  return apiClient.put("/staff/resetUserPassword", data);
};

export const editKitchenUser = async (username: string) => {
  return apiClient.put("/staff/editKitchen", { username });
};

export const changePosIp = async (ip: string) => {
  return apiClient.put(`/staff/change/posIp?ip=${ip}`);
};

export const changeKitchenIp = async (ip: string) => {
  return apiClient.put(`/staff/change/kitchenIp?ip=${ip}`);
};

export const changeBarIp = async (ip: string) => {
  return apiClient.put(`/staff/change/barIp?ip=${ip}`);
};

export const changeAdditionPercentage = async (percentage: string) => {
  return apiPut(`/staff/change/additionPercentage?percentage=${percentage}`);
};

export const addKitchenUser = async () => {
  return apiClient.post("/staff/addKitchen");
};

export const addAdmin = async () => {
  return apiClient.post("/staff/addAdmin");
};

export const viewKitchenUsers = async () => {
  const response = await apiClient.get("/staff/viewKitchen");
  return response.data;
};

export const viewAllUsers = async () => {
  const response = await apiClient.get("/staff/viewAllUsers");
  return response.data;
};

export const deleteKitchenUser = async () => {
  return apiClient.delete("/staff/deleteKitchen");
};

export const deleteAdmin = async () => {
  return apiClient.delete("/staff/deleteAdmin");
};
