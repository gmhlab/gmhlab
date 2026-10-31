import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import type { AuthService, Credentials, Registration, User } from "@gmhlab/core";

export type AuthProviderProps = {
  /** The auth backend. Pass a stable reference — a new object re-runs session restore. */
  service: AuthService;
  children?: ReactNode;
};

/**
 * Authentication provider with full state management
 */
export function AuthProvider({ service, children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Restore an existing session on mount
  useEffect(() => {
    let cancelled = false;
    service
      .getCurrentUser()
      .then(
        (storedUser) => {
          if (!cancelled && storedUser) setUser(storedUser);
        },
        () => {},
      )
      .finally(() => {
        if (!cancelled) setIsReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [service]);

  const login = useCallback(async (credentials: Credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await service.login(credentials);
      setUser(user);
    } catch (err) {
      setError(err as Error);
      throw err; // Re-throw so components can handle it
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  const register = useCallback(async (registration: Registration) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await service.register(registration);
      setUser(user);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await service.logout();
      setUser(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      isLoading,
      isReady,
      error,
      login,
      register,
      logout,
      clearError,
    }),
    [user, isLoading, isReady, error, login, register, logout, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}