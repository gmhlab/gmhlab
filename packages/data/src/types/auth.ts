import type { Credentials, Registration, User } from "@gmhlab/core";

/**
 * Authentication context type
 */
export interface AuthContextType {
  /**
   * The current user. null if unauthenticated.
   */
  user: User | null;
  /**
   * Whether an authentication operation is in progress
   */
  isLoading: boolean;
  /**
   * Any authentication error
   */
  error: Error | null;
  /**
   * Method to log a user in
   */
  login: (credentials: Credentials) => Promise<void>;
  /**
   * Open sign-up: create an account and sign it in
   */
  register: (registration: Registration) => Promise<void>;
  /**
   * False until the stored session has been checked on load. Gate signed-in
   * routes on this, or they redirect before the session is restored.
   */
  isReady: boolean;
  /**
   * Method to log a user out
   */
  logout: () => void;
  /**
   * Clear any authentication errors
   */
  clearError: () => void;
}