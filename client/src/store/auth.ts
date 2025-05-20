import { create } from "zustand";
import { AuthState, User } from "@/types";

export const useAuth = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token"),
  loading: true,

  setAuth: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, loading: false });
  },

  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: null, loading: false });
  },

  setLoading: (loading) => set({ loading }),
}));
