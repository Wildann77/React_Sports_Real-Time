import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/shared/types/models';

type AuthState = {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  setAuth: (payload: { accessToken: string; user: User }) => void;
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setAuthReady: (isReady: boolean) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isAuthReady: false,
      setAuth: (payload) =>
        set({
          accessToken: payload.accessToken,
          user: payload.user,
          isAuthenticated: true,
          isAuthReady: true,
        }),
      setAccessToken: (token) =>
        set((state) => ({
          accessToken: token,
          user: token ? state.user : null,
          isAuthenticated: Boolean(token && state.user),
        })),
      setUser: (user) =>
        set((state) => ({
          user,
          isAuthenticated: Boolean(state.accessToken && user),
        })),
      setAuthReady: (isReady) => set({ isAuthReady: isReady }),
      clearAuth: () =>
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
          isAuthReady: true,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
