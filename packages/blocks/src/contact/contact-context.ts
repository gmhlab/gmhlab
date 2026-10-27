import { createContext, useContext } from "react";
import type { ContactTopic } from "./contact-types";

/* Internal to @gmhlab/blocks. ContactPage takes its form as a slot (the form
 * needs a send function, and page blocks take no function props), so the
 * page and the form it is handed share the chosen topic through this. */

export type ContactPageState = {
  topics: ContactTopic[];
  topic: string;
  setTopic: (id: string) => void;
  email: string | null;
  replyTime?: string;
};

export const ContactPageContext = createContext<ContactPageState | null>(null);

export const useContactPage = () => useContext(ContactPageContext);

/** The form section's id — the target of every "write to us" link. */
export const CONTACT_FORM_ID = "contact-form";
