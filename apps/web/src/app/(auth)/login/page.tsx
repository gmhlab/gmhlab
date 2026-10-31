import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteAuthScreen } from "@/components/site-auth-screen";

export const metadata: Metadata = {
  title: "Sign in · GW Global Mental Health",
};

/** Sign in / sign up. The screen reads `?mode` and `?next`, hence Suspense. */
export default function LoginPage() {
  return (
    <Suspense>
      <SiteAuthScreen />
    </Suspense>
  );
}
