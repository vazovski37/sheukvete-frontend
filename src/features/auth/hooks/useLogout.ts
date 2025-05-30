// src/features/auth/hooks/useLogout.ts

import { useMutation } from "@tanstack/react-query";
import { destroyCookie } from "nookies";
import { useRouter } from "next/navigation";
import API_ROUTES from "@/constants/apiRoutes"; //
import { apiPost } from "@/utils/axiosInstance"; //
import { useUserStore } from "@/stores/userStore"; // Import user store to clear Zustand state

export const useLogout = () => {
  const router = useRouter();
  const logoutUserStore = useUserStore((state) => state.logout); // Get Zustand logout action

  const mutation = useMutation({
    mutationFn: async () => {
      // Call backend logout endpoints
      // It's good practice to invalidate cookies on the backend even if HttpOnly
      // Call endpoint to clear user-level token
      try {
        await apiPost(API_ROUTES.AUTH.LOGOUT); // This will hit /api/proxy/auth/logout, which clears "token" cookie
      } catch (error) {
        console.warn("User-level logout API call failed (might already be logged out):", error);
      }

      // If restaurant-level token also needs to be cleared from frontend logout:
      // (This assumes a separate endpoint for clearing RESTAURANT_JWT)
      try {
        await apiPost(API_ROUTES.AUTH.LOGOUT_RESTAURANT); // This will hit /api/proxy/auth/restaurant/logout
      } catch (error) {
        console.warn("Restaurant-level logout API call failed (might already be logged out):", error);
      }

      // Clear cookies from the client-side as well, though HttpOnly makes them inaccessible to JS directly,
      // destroying them ensures Next.js's server-side cookie parsing sees them as gone.
      destroyCookie(null, "token", { path: '/' }); // Clear user-level token cookie
      destroyCookie(null, "role", { path: '/' }); // Clear role cookie
      destroyCookie(null, "RESTAURANT_JWT", { path: '/' }); // Clear restaurant-level token cookie

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