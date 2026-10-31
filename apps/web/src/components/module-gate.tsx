"use client";

import { type DashboardLinkComponent, LockedModule, toast } from "@gmhlab/blocks";
import { type Account, canAccess } from "@gmhlab/core";
import { useAccount, useProducts } from "@gmhlab/data";
import Link from "next/link";
import type { ReactNode } from "react";
import { DASHBOARD_MODULES } from "@/content/dashboard-modules";

/**
 * Renders `children(account)` when the signed-in account can open the module,
 * the blocks `LockedModule` (wired to the cart) when it can't. The sidebar's
 * locks and this gate both read core's `canAccess`, so they always agree.
 */
export function ModuleGate({ id, children }: { id: string; children: (account: Account) => ReactNode }) {
  const { account } = useAccount();
  const { cart, addToCart } = useProducts();
  const module = DASHBOARD_MODULES.find((m) => m.id === id);
  if (!account || !module) return null;
  if (canAccess(account, module)) return <>{children(account)}</>;
  return (
    <LockedModule
      module={module}
      storeHref="/dashboard#store"
      inCart={cart.items.some((item) => item.product.id === id)}
      onAddToCart={() => {
        addToCart(id);
        toast("Added to your cart", "Check out from the bag in the top bar.");
      }}
      linkComponent={Link as unknown as DashboardLinkComponent}
    />
  );
}
