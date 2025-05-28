import { useCreateOrUpdateOrder } from "./useCreateOrUpdateOrder";
import { useOrderByTableId } from "./useOrderByTableId";

export function useOrdersManagement() {
    const { data: order, refetch } = useOrderByTableId(...);
    const { mutateAsync: handleUpdateOrder } = useCreateOrUpdateOrder();
    const { mutateAsync: handleCreateOrder } = useCreateOrUpdateOrder(); // same endpoint
  
    const loadOrder = async (tableId: number): Promise<boolean> => {
      try {
        await refetch();
        return true;
      } catch {
        return false;
      }
    };
  
    return {
      order,
      loading: isLoading,
      loadOrder,
      handleUpdateOrder,
      handleCreateOrder,
    };
  }
  