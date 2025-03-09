import { apiClient } from "@/lib/axios";

export const fetchFoods = async () => {
  const response = await apiClient.get("/admin/viewFoods");
  return response.data;
};

export const addFood = async (data: {
  name: string;
  categoryId: number;
  price: number;
  comment1?: string;
  comment2?: string;
  comment3?: string;
  comment4?: string;
}) => {
  const response = await apiClient.post("/admin/addFood", data);
  return response.data;
};

export const editFood = async (id: number, data: {
  name: string;
  categoryId: number;
  price: number;
  comment1?: string;
  comment2?: string;
  comment3?: string;
  comment4?: string;
}) => {
  const response = await apiClient.put(`/admin/editFood/${id}`, data);
  return response.data;
};

export const deleteFood = async (id: number) => {
  const response = await apiClient.delete(`/admin/deleteFood/${id}`);
  return response.data;
};
