"use client";

import { DashboardHome, type DashboardLinkComponent } from "@gmhlab/blocks";
import { useAccount, useCheckout, useLearning, useProducts } from "@gmhlab/data";
import { planLineId, type PlanSku } from "@gmhlab/core";
import Link from "next/link";
import { toast } from "@gmhlab/blocks";
import { DASHBOARD_FEED, DASHBOARD_MODULES, DASHBOARD_PLANS } from "@/content/dashboard-modules";
import { COURSES } from "@/content/equip-training";

export default function DashboardHomeRoute() {
  const { account } = useAccount();
  const { progress } = useLearning();
  const { cart, addToCart } = useProducts();
  const { checkout } = useCheckout();
  if (!account) return null;

  return (
    <DashboardHome
      account={account}
      modules={DASHBOARD_MODULES}
      courses={COURSES}
      progress={progress}
      coursesPath="/dashboard/equip"
      plans={DASHBOARD_PLANS}
      announcements={DASHBOARD_FEED.announcements}
      events={DASHBOARD_FEED.events}
      cartIds={cart.items.map((item) => item.product.id)}
      onAddToCart={(id) => {
        addToCart(id);
        toast("Added to your cart", "Open the bag in the top bar to check out.");
      }}
      onChoosePlan={async (plan) => {
        const sku = plan.sku as PlanSku;
        await checkout([{ id: planLineId(sku), name: `${plan.name} plan`, price: plan.price }], sku);
        toast(`You're on ${plan.name}`, "Everything in the plan is unlocked. (Demo — nothing was charged.)");
      }}
      linkComponent={Link as unknown as DashboardLinkComponent}
    />
  );
}
