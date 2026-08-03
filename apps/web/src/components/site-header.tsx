"use client";

import { useAuth } from "@gmhlab/blocks";
import { Header } from "@gmhlab/ui";

// Mock credentials accepted by the blocks auth service.
const DEMO_CREDENTIALS = { email: "Charlie Brown", password: "snooptroupe" };

/** The ui Header wired to the blocks auth layer. */
export function SiteHeader() {
  const { user, login, logout } = useAuth();
  return (
    <Header
      user={user ? { name: user.name, avatar: user.avatar } : null}
      onLogin={() => login(DEMO_CREDENTIALS)}
      onRegister={() => login(DEMO_CREDENTIALS)}
      onLogout={logout}
    />
  );
}
