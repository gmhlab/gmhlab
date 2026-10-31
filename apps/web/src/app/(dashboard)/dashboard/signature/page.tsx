"use client";

import { EmailSignatureBuilder } from "@gmhlab/blocks";
import { useAccount } from "@gmhlab/data";

export default function SignatureRoute() {
  const { account } = useAccount();
  if (!account) return null;
  return (
    <EmailSignatureBuilder
      key={account.id}
      defaults={{ name: account.name, pronouns: account.pronouns, title: account.title, email: account.email }}
    />
  );
}
