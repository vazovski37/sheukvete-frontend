// stores/userStore.ts
import { create } from "zustand";

type UserState = {
  tenantId: string;
  token: string;
  role: string;
};

type Store = {
  user: UserState | null;
  setUser: (user: UserState) => void;
  logout: () => void;
};

export const useUserStore = create<Store>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
