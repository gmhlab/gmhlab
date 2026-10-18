import type { AuthService, User } from "../auth";
import { delay } from "./delay";

const USER_KEY = "current-user";
const TOKEN_KEY = "auth-token";

/**
 * Accepts any credentials except `error@example.com`, and keeps the "session"
 * in localStorage. Every storage access is guarded, so the service is safe to
 * construct during server rendering and in browsers that block storage.
 */
export const mockAuthService: AuthService = {
  async login(credentials) {
    await delay(1000);

    if (credentials.email === "error@example.com") {
      throw new Error("Invalid credentials");
    }

    const user: User = {
      id: "1",
      name: "John Doe",
      email: credentials.email,
      username: credentials.email.split("@")[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
    };
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_KEY, "mock-token");
    } catch {}
    return user;
  },

  async logout() {
    await delay(500);
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {}
  },

  async getCurrentUser() {
    try {
      if (localStorage.getItem(TOKEN_KEY) === null) return null;
      const userData = localStorage.getItem(USER_KEY);
      return userData ? (JSON.parse(userData) as User) : null;
    } catch {
      return null;
    }
  },
};
