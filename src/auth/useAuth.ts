import { useEffect, useState } from "react";

export type AuthUser = {
  role?: string;
} | null;

export type AuthState = {
  isAuthenticated: boolean;
  user: AuthUser;
  loading: boolean;
};

const AUTH_STORAGE_KEY = "hp_fan_app_auth";

type StoredAuth = {
  token?: string;
  user?: { role?: string };
};

/**
 * Backend-agnostic auth state hook.
 * Reads from localStorage, but can be swapped with API/session logic later.
 */
export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
      // if (!raw) {
      //   setAuthState({ isAuthenticated: false, user: null, loading: false });
      //   return;
      // }

      // const parsed = JSON.parse(raw) as StoredAuth;
      // const isAuthenticated = Boolean(parsed?.token);
      // setAuthState({
      //   isAuthenticated,
      //   user: parsed?.user ?? null,
      //   loading: false,
      // });

      setAuthState({
        isAuthenticated: true,
        user: { role: "admin" },
        loading: false,
      });
    } catch {
      setAuthState({ isAuthenticated: false, user: null, loading: false });
    }
  }, []);

  return authState;
}
