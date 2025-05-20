import { create } from "zustand";
import { AuthState, User } from "@/types";

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: true,
  setAuth: (user) => set({ user, loading: false }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null, loading: false }),
  setLoading: (loading) => set({ loading }),
}));
