"use client";

import { AccountProfilePage, toast } from "@gmhlab/blocks";
import { useAccount, useCheckout } from "@gmhlab/data";
import { PROJECT_OPTIONS } from "@/content/dashboard-workspace";

export default function AccountRoute() {
  const { account, activity, saveProfile, requestAccess } = useAccount();
  const { orders } = useCheckout();
  if (!account) return null;
  return (
    <AccountProfilePage
      key={account.id}
      account={account}
      activity={activity}
      orders={orders}
      projects={PROJECT_OPTIONS}
      onSave={saveProfile}
      onRequestAccess={async (input) => {
        await requestAccess(input);
        toast("Request sent", "An admin will review it.");
      }}
    />
  );
}
