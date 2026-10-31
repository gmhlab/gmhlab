"use client";

import { type AuthMode, AuthScreen } from "@gmhlab/blocks";
import { DEMO_PASSWORD } from "@gmhlab/core/mocks";
import { useAuth } from "@gmhlab/data";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const DEMO_ACCOUNTS = [
  { email: "member@demo.gmhlab.org", label: "Member" },
  { email: "partner@demo.gmhlab.org", label: "Project partner" },
  { email: "staff@demo.gmhlab.org", label: "Staff" },
  { email: "admin@demo.gmhlab.org", label: "Admin" },
];

/** Only same-site paths, so `?next=` can't bounce someone off-site. */
function safeNext(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

/** The blocks AuthScreen bound to `useAuth` and the URL. */
export function SiteAuthScreen() {
  const { user, isReady, login, register } = useAuth();
  const params = useSearchParams();
  const router = useRouter();
  const mode: AuthMode = params.get("mode") === "signup" ? "signup" : "signin";
  const next = safeNext(params.get("next"));

  // Already signed in (or just signed in): go on to the workspace.
  useEffect(() => {
    if (isReady && user) router.replace(next);
  }, [isReady, user, next, router]);

  return (
    <AuthScreen
      mode={mode}
      onModeChange={(m) => router.replace(m === "signup" ? `/login?mode=signup` : `/login`, { scroll: false })}
      onSignIn={login}
      onRegister={register}
      demoAccounts={DEMO_ACCOUNTS}
      demoPassword={DEMO_PASSWORD}
    />
  );
}
