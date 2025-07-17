import { create } from "zustand";

interface AuthState {
  token: string | null;
  user: {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
  } | null;
  setToken: (token: string) => void;
  login: (
    token: string,
    user: {
      id: string;
      email: string;
      role: string;
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      dateOfBirth?: string;
    }
  ) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setToken: (token: string) => set({ token }),
  login: (
    token: string,
    user: {
      id: string;
      email: string;
      role: string;
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      dateOfBirth?: string;
    }
  ) => set({ token, user }),
  logout: () => set({ token: null, user: null }),
}));
