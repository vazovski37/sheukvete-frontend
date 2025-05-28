import API_ROUTES from "@/constants/apiRoutes";
import { apiGet, apiPost, apiPut } from "@/utils/axiosInstance";
import { KitchenOrder } from "./types";

export const getKitchenOrders = async (): Promise<KitchenOrder[]> => {
  return apiGet(API_ROUTES.KITCHEN.ORDERS);
};

export const toggleCookingStatus = async (tableId: number): Promise<void> => {
  return apiPut(`${API_ROUTES.KITCHEN.ORDERS}/${tableId}/isCooking`);
};

export const printKitchenItems = async ({
  tableId,
  orderItemIds,
}: {
  tableId: number;
  orderItemIds: number[];
}): Promise<void> => {
  return apiPost(`/api/kitchen/orders/print`, { tableId, orderItemIds });
};