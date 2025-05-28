const API_ROUTES = {
    AUTH: {
      LOGIN: "/auth/login",
      LOGOUT: "/auth/logout",
      LOGINRESTAURANTASUSER: "/auth/general/login",
    },
    RESERVATIONS: {
      GET_ALL: "/reservations",
      GET_BY_ID: (id: number) => `/reservations/${id}`,
      CREATE: "/reservations",
      UPDATE: (id: number) => `/reservations/${id}`,
      DELETE: (id: number) => `/reservations/${id}`,
    },
    SYSADMIN: {
      RESTAURANTS: {
        BASE: "/restaurant/admin",
        BY_ID: (id: number) => `/restaurant/admin/${id}`,
      },
    },
    WAITER: {
      MOVE_ORDER: (sourceTableId: number, targetTableId: number) =>
        `/waiter/move/${sourceTableId}/${targetTableId}`,
      GET_ORDER: (tableId: number) => `/waiter/orders/${tableId}`,
      CREATE_OR_UPDATE_ORDER: (tableId: number) => `/waiter/orders/${tableId}`,
      DELETE_ORDER: (tableId: number) => `/waiter/orders/${tableId}`,
      DELETE_PARTIAL_ITEMS: (tableId: number) =>
        `/waiter/orders/${tableId}/items`,
      PRINT_ORDER: (tableId: number) => `/waiter/orders/${tableId}/print`,
      GET_ALL_ORDERS: "/waiter/orders",
      GET_ORDER_HISTORY: "/waiter/orders/history",
      VIEW_TABLES: "/waiter/viewTables",
      VIEW_OCCUPIED_TABLES: "/waiter/viewOccupiedTables",
      GET_FOOD_COMMENTS: (foodId: number) => `/waiter/food/${foodId}/comments`,
    },
    KITCHEN:{
      ORDERS: '/kitchen/orders'
    }
  };
  
  export default API_ROUTES;
  