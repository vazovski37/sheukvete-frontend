// src/features/auth/hooks/useLogout.ts

import { useMutation } from "@tanstack/react-query";
import { destroyCookie } from "nookies";
import { useRouter } from "next/navigation";
import API_ROUTES from "@/constants/apiRoutes";
import { apiPost } from "@/utils/axiosInstance";
import { useUserStore } from "@/stores/userStore";

export const useLogout = () => {
  const router = useRouter();
  const logoutUserStore = useUserStore((state) => state.logout);

  const mutation = useMutation({
    mutationFn: async () => {
      // Call backend logout endpoints
      // Note: If backend doesn't have an endpoint to clear the 'token' cookie,
      // the client-side destroyCookie is critical here.
      try {
        await apiPost(API_ROUTES.AUTH.LOGOUT); // This might be for user-level token cleanup on backend
      } catch (error) {
        console.warn("User-level logout API call failed (might already be logged out or endpoint not found):", error);
      }

      try {
        await apiPost(API_ROUTES.AUTH.LOGOUT_RESTAURANT); // This clears RESTAURANT_JWT on backend
      } catch (error) {
        console.warn("Restaurant-level logout API call failed (might already be logged out or endpoint not found):", error);
      }

      // Clear cookies from the client-side.
      // Since 'token' is now set by JS, it can be destroyed by JS.
      destroyCookie(null, "token", { path: '/' }); // Clear user-level token cookie
      destroyCookie(null, "role", { path: '/' }); // Clear role cookie (non-HttpOnly)
      destroyCookie(null, "RESTAURANT_JWT", { path: '/' }); // Clear restaurant-level token cookie (HttpOnly, but good to try destroying)

      // Clear Zustand user store
      logoutUserStore();
    },
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error) => {
      console.error("Logout failed", error);
      // Even if API logout fails, clear client-side state and redirect for UX
      destroyCookie(null, "token", { path: '/' });
      destroyCookie(null, "role", { path: '/' });
      destroyCookie(null, "RESTAURANT_JWT", { path: '/' });
      logoutUserStore();
      router.push("/login");
    },
  });

  return {
    logout: mutation.mutate,
    ...mutation,
  };
};