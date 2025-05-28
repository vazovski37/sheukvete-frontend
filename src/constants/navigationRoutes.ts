const NAVIGATION_ROUTES = {
    HOME: "/",
    ABOUT: "/about-us",
    CONTACT: "/contact",
    FAQ: "/FAQ",
    NOT_FOUND: "/404",
    TERMS: "/termsofservice",  
    PRIVACY: "/privacypolicy", 
    LOGIN: "/login",
    REGISTER: "/register",
    VERIFY: "/verify",
    VERIFY_EMAIL: "/verify?email=",
    PROFILE: "/dashboard/profile",
    LOGOUT: "/logout",
    TICKETS: "/ticket",
    FEEDBACK: "/feedback",
    AGENT_DASHBOARD: "/dashboard/agent",
    AGENT_FAQ : "/agent-FAQ",
    DRIVER_DASHBOARD: "/dashboard/driver",
    ADMIN_DASHBOARD: "/dashboard/admin",
    FORGOT_PASSWORD: "/forgot-password",
    PURCHASE_BASE : "/purchase",
    RESET_PASSWORD: (token: string, email: string) => `/password-reset/${token}?email=${email}`,
    PURCHASE: (routeId: string, timetableId: string, travelDate: string) =>
    `/purchase?route_id=${routeId}&timetable_id=${timetableId}&travel_date=${travelDate}`,
  };
  
  export default NAVIGATION_ROUTES;
  