import { apiClient } from "@/lib/axios";

interface PrintOrderRequest {
  tableId: number;
  orderItemIds: number[];
}

export const toggleCookingStatus = async (tableId: number) => {
  return apiClient.put(`/kitchen/orders/${tableId}/isCooking`);
};

export const printKitchenOrder = async (data: PrintOrderRequest) => {
  return apiClient.post("/kitchen/orders/print", data);
};

export const fetchKitchenOrders = async () => {
  const response = await apiClient.get("/kitchen/orders");
  return response.data;
};
