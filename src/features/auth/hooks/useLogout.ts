// src/features/auth/hooks/useLogout.ts

import { useMutation } from "@tanstack/react-query";
import { destroyCookie } from "nookies";
import { useRouter } from "next/navigation";
import API_ROUTES from "@/constants/apiRoutes";
import { apiPost } from "@/utils/axiosInstance";

export const useLogout = () => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      await apiPost(API_ROUTES.AUTH.LOGOUT);
      destroyCookie(null, "token");
      destroyCookie(null, "role");
    },
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error) => {
      console.error("Logout failed", error);
    },
  });

  // Rename `mutate` to `logout` for clarity
  return {
    logout: mutation.mutate,
    ...mutation,
  };
};
