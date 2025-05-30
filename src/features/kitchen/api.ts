import API_ROUTES from "@/constants/apiRoutes";
import { apiGet, apiPost, apiPut } from "@/utils/axiosInstance";
import { KitchenOrder } from "./types";

export const getKitchenOrders = async (): Promise<KitchenOrder[]> => {
  return apiGet(API_ROUTES.KITCHEN.GET_ORDERS);
};

export const toggleCookingStatus = async (tableId: number): Promise<void> => {
  return apiPut(`${API_ROUTES.KITCHEN.TOGGLE_COOKING_STATUS}/${tableId}/isCooking`);
};

export const printKitchenItems = async ({
  tableId,
  orderItemIds,
}: {
  tableId: number;
  orderItemIds: number[];
}): Promise<void> => {
  return apiPost(API_ROUTES.KITCHEN.PRINT_ITEMS, { tableId, orderItemIds });
};