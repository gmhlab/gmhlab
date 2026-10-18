import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import type { Credentials, User } from "@gmhlab/core";
// Hardwired until @gmhlab/data takes the service as a prop.
import { mockAuthService as authService } from "@gmhlab/core/mocks";

/**
 * Authentication provider with full state management
 */
export function AuthProvider({ children }: { children?: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Restore an existing session on mount
  useEffect(() => {
    let cancelled = false;
    authService.getCurrentUser().then(
      (storedUser) => {
        if (!cancelled && storedUser) setUser(storedUser);
      },
      () => {},
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (credentials: Credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await authService.login(credentials);
      setUser(user);
    } catch (err) {
      setError(err as Error);
      throw err; // Re-throw so components can handle it
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      isLoading,
      error,
      login,
      logout,
      clearError,
    }),
    [user, isLoading, error, login, logout, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}