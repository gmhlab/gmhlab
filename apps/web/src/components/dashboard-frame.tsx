"use client";

import {
  DashboardCart,
  type DashboardLinkComponent,
  DashboardShell,
  DashboardSkeleton,
  type DemoAccountOption,
  toast,
} from "@gmhlab/blocks";
import { DEMO_PASSWORD, resetMockWorkspace } from "@gmhlab/core/mocks";
import { useAccount, useAuth, useCheckout, useProducts } from "@gmhlab/data";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { DASHBOARD_MODULES } from "@/content/dashboard-modules";
import { useTheme } from "./theme-provider";
import { SiteWorkspaceProviders } from "./workspace-providers";

/** The seeded demo accounts (core/mocks), for the shell's "view as" menu. */
const DEMO_ACCOUNTS: DemoAccountOption[] = [
  { email: "member@demo.gmhlab.org", label: "Member" },
  { email: "partner@demo.gmhlab.org", label: "Project partner" },
  { email: "staff@demo.gmhlab.org", label: "Staff" },
  { email: "admin@demo.gmhlab.org", label: "Admin" },
];

const NextLink = Link as unknown as DashboardLinkComponent;

/** Whether the page is dark right now — the class the theme provider sets. */
function useIsDark(): boolean {
  const { theme } = useTheme();
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const read = () => setDark(document.documentElement.classList.contains("dark"));
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [theme]);
  return dark;
}

function Shell({ children }: { children: ReactNode }) {
  const { login, logout } = useAuth();
  const { account, queue } = useAccount();
  const { cart, removeFromCart, clearCart } = useProducts();
  const { checkout } = useCheckout();
  const { setTheme } = useTheme();
  const isDark = useIsDark();
  const pathname = usePathname();
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);

  if (!account) return <DashboardSkeleton />;

  const pendingReviews = queue
    ? queue.submissions.filter((s) => s.status === "pending").length +
      queue.requests.filter((r) => r.status === "pending").length
    : 0;

  return (
    <DashboardShell
      account={account}
      modules={DASHBOARD_MODULES}
      pathname={pathname}
      linkComponent={NextLink}
      onNavigate={(href) => router.push(href)}
      cartCount={cart.items.reduce((n, item) => n + item.quantity, 0)}
      onOpenCart={() => setCartOpen(true)}
      isDark={isDark}
      onToggleTheme={() => setTheme(isDark ? "light" : "dark")}
      pendingReviews={pendingReviews}
      reviewsModuleId="reviews"
      onSignOut={async () => {
        await logout();
        router.push("/login");
      }}
      demoAccounts={DEMO_ACCOUNTS}
      onSwitchAccount={async (option) => {
        await login({ email: option.email, password: DEMO_PASSWORD });
        toast(`Viewing as ${option.label}`, "The sidebar, locks and queues follow the role.", "info");
      }}
      onResetDemo={() => {
        resetMockWorkspace();
        window.location.reload();
      }}
      overlays={
        <DashboardCart
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          modules={DASHBOARD_MODULES}
          lines={cart.items.map(({ product, quantity }) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
          }))}
          onRemove={removeFromCart}
          onCheckout={async () => {
            await checkout(cart.items.map(({ product }) => ({ id: product.id, name: product.name, price: product.price })));
            clearCart();
            toast("Order placed", "Your add-ons are unlocked. (Demo — nothing was charged.)");
          }}
        />
      }
    >
      {children}
    </DashboardShell>
  );
}

/**
 * The dashboard's client boundary: waits for the session to restore, sends
 * signed-out visitors to /login, mounts the workspace providers, and binds
 * the blocks shell to the data hooks and the router.
 */
export function DashboardFrame({ children }: { children: ReactNode }) {
  const { user, isReady } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [isReady, user, pathname, router]);

  if (!isReady || !user) return <DashboardSkeleton />;

  return (
    <SiteWorkspaceProviders>
      <Shell>{children}</Shell>
    </SiteWorkspaceProviders>
  );
}
