"use client"

import { InnovationDetailPage } from "@gmhlab/blocks"

import { EQUIP_DETAIL, PUBLICATIONS } from "@/content"

export default function Page() {
  return (
    <InnovationDetailPage detail={EQUIP_DETAIL} publications={PUBLICATIONS} />
  );
}
