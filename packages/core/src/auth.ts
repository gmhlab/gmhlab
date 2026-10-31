import type { Registration } from "./workspace";

/**
 * A signed-in user.
 */
export type User = {
  /** The full name of the user */
  name: string;
  /** A url to a user avatar image */
  avatar?: string;
  /** A username */
  username?: string;
  /** User email */
  email?: string;
  /** User ID */
  id?: string;
};

/**
 * Login credentials
 */
export type Credentials = {
  email: string;
  password: string;
};

/**
 * What an auth backend must provide. Session persistence (cookies, tokens,
 * storage) is the service's own business: `login` establishes the session,
 * `logout` ends it, and `getCurrentUser` restores it on load.
 */
export interface AuthService {
  /** Sign in. Rejects on bad credentials. */
  login(credentials: Credentials): Promise<User>;
  /**
   * Open sign-up: create an account and sign it in. Rejects when the email is
   * taken. What the new account may reach is the backend's business (in the
   * member workspace, every new account is a `member`).
   */
  register(registration: Registration): Promise<User>;
  /** End the current session. */
  logout(): Promise<void>;
  /** The user of an existing session, or null when there is none. */
  getCurrentUser(): Promise<User | null>;
}
