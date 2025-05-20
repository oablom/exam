import { create } from "zustand";
import { AuthState, User } from "@/types";

export const useAuth = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token"),
  loading: true,

  setAuth: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
  },

  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },

  logout: async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("Kunde inte logga ut från servern", e);
    }

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: null, loading: false });
  },

  setLoading: (loading) => set({ loading }),
}));
