// store/auth.ts
import { create } from "zustand";

interface User {
  id: string;
  name?: string;
  email: string;
}

interface AuthState {
  user: User | null;
  setAuth: (user: User) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  setAuth: (user) => set({ user }),
  logout: () => {
    set({ user: null });
  },
}));
