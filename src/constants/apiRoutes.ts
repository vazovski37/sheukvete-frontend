// src/constants/apiRoutes.ts

const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login", // Initial restaurant/sysadmin login
    LOGIN_GENERAL: "/auth/general/login", // User login within a restaurant
    LOGOUT: "/auth/logout", // User-level logout (clears "token" cookie)
    LOGOUT_RESTAURANT: "/auth/restaurant/logout", // Restaurant-level logout (clears "RESTAURANT_JWT" cookie)
  },
  ADMIN: {
    CATEGORIES: {
      GET_ALL: "/admin/viewCategories",
      ADD: "/admin/addCategory",
      EDIT_BY_ID: (id: number) => `/admin/editCategory/${id}`,
      DELETE_BY_ID: (id: number) => `/admin/deleteCategory/${id}`,
    },
    FOODS: {
      GET_ALL: "/admin/viewFoods",
      ADD: "/admin/addFood",
      EDIT_BY_ID: (id: number) => `/admin/editFood/${id}`,
      DELETE_BY_ID: (id: number) => `/admin/deleteFood/${id}`,
    },
    TABLES: {
      GET_ALL: "/admin/viewTables",
      ADD: "/admin/addTable",
      EDIT_BY_ID: (id: number) => `/admin/editTable/${id}`,
      DELETE_BY_ID: (id: number) => `/admin/deleteTable/${id}`,
    },
    WAITERS: { // Admin management of waiters
      GET_ALL: "/admin/viewWaiters",
      ADD: "/admin/addWaiter",
      EDIT_BY_ID: (id: number) => `/admin/editWaiter/${id}`,
      DELETE_BY_ID: (id: number) => `/admin/deleteWaiter/${id}`,
    },
    FINANCE: {
      SUMMARY: "/admin/finances", // GET with query params: start, end
      FOOD_SALES: "/admin/finances/food-sales", // GET with query params: start, end
    },
    DASHBOARD: {
      STATS: "/admin/finances", // GET - Used by dashboardService
    },
  },
  WAITER: {
    VIEW_TABLES: "/waiter/viewTables", // GET all tables visible to waiter
    VIEW_OCCUPIED_TABLES: "/waiter/viewOccupiedTables", // GET
    GET_ORDER_BY_TABLE_ID: (tableId: number) => `/waiter/orders/${tableId}`, // GET
    CREATE_OR_UPDATE_ORDER: (tableId: number) => `/waiter/orders/${tableId}`, // POST or PUT
    DELETE_FULL_ORDER: (tableId: number) => `/waiter/orders/${tableId}`, // DELETE - for full payment
    DELETE_PARTIAL_ORDER_ITEMS: (tableId: number) => `/waiter/orders/${tableId}/items`, // DELETE (or POST) with items in body
    MOVE_ORDER: (sourceTableId: number, targetTableId: number) => `/waiter/move/${sourceTableId}/${targetTableId}`, // PUT
    PRINT_ORDER_RECEIPT: (tableId: number) => `/waiter/orders/${tableId}/print`, // GET
    GET_AVAILABLE_FOODS: "/waiter/orders", // GET - For fetching meals and drinks for ordering (fetchFoodsForWaiters)
    GET_ORDER_HISTORY: "/waiter/orders/history", // GET
    GET_FOOD_COMMENTS: (foodId: number) => `/waiter/food/${foodId}/comments`, // GET
  },
  KITCHEN: {
    GET_ORDERS: "/kitchen/orders", // GET all orders for kitchen display
    TOGGLE_COOKING_STATUS: (tableId: number) => `/kitchen/orders/${tableId}/isCooking`, // PUT
    PRINT_ITEMS: "/kitchen/orders/print", // POST with { tableId, orderItemIds }
  },
  STAFF: {
    RESET_USER_PASSWORD: "/staff/resetUserPassword", // PUT
    EDIT_KITCHEN_USER: "/staff/editKitchen", // PUT (expects username)
    ADD_KITCHEN_USER: "/staff/addKitchen", // POST
    VIEW_KITCHEN_USERS: "/staff/viewKitchen", // GET
    DELETE_KITCHEN_USER: "/staff/deleteKitchen", // DELETE
    ADD_ADMIN_USER: "/staff/addAdmin", // POST
    VIEW_ALL_USERS: "/staff/viewAllUsers", // GET
    DELETE_ADMIN_USER: "/staff/deleteAdmin", // DELETE
    CHANGE_POS_IP: "/staff/change/posIp", // PUT (expects ?ip=)
    CHANGE_KITCHEN_IP: "/staff/change/kitchenIp", // PUT (expects ?ip=)
    CHANGE_BAR_IP: "/staff/change/barIp", // PUT (expects ?ip=)
    CHANGE_ADDITION_PERCENTAGE: "/staff/change/additionPercentage", // PUT (expects ?percentage=)
  },
  SYSADMIN: {
    RESTAURANTS: {
      BASE: "/restaurant/admin", // Base endpoint for all restaurant admin operations
      GET_ALL: "/restaurant/admin", // Redundant but kept for clarity
      CREATE: "/restaurant/admin", // Redundant but kept for clarity
      BY_ID: (id: number) => `/restaurant/admin/${id}`, // For specific restaurant by ID
      UPDATE_BY_ID: (id: number) => `/restaurant/admin/${id}`, // Redundant but kept for clarity
      DELETE_BY_ID: (id: number) => `/restaurant/admin/${id}`, // Redundant but kept for clarity
    },
  },
};

export default API_ROUTES;