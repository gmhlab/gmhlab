import { ContactPage } from "@gmhlab/blocks";
import type { Metadata } from "next";

import { SiteContactForm } from "../../components/site-contact-form";
import { CENTER_LOCATION, CONTACT_REPLY_TIME, CONTACT_TOPICS } from "@/content";

export const metadata: Metadata = {
  title: "Contact | GW Global Mental Health",
  description:
    "Research partnerships, EQUIP training, students and media — and where to find mental health support, which the Center does not provide.",
};

/* A server component, unlike the other routes: every prop is data, and the
   form — the one piece that needs a function — arrives as a client element. */
export default function Page() {
  return (
    <ContactPage
      topics={CONTACT_TOPICS}
      location={CENTER_LOCATION}
      replyTime={CONTACT_REPLY_TIME}
      form={<SiteContactForm />}
    />
  );
}
