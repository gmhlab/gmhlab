import { ContactForm, ContactPage } from "@gmhlab/blocks";
import { mockContactService } from "@gmhlab/core/mocks";

import {
  CENTRE_EMAIL,
  CONTACT_LOCATION,
  CONTACT_TOPICS,
} from "../../fixtures/sample-content";
import { DemoFrame } from "./DemoFrame";

/**
 * The contact page over the synthetic institute. No RSC boundary here, so
 * the form gets the mock service directly; `apps/web` binds it through
 * `useContact()` in a client wrapper instead. Send from `error@example.com`
 * to see the failure state and its email fallback.
 */
export function BlocksContactPage() {
  return (
    <DemoFrame
      component="ContactPage"
      blurb="A contact page that works as a pitch: a not-a-care-provider notice with crisis lines first, one card per inquiry route saying what the organization offers, then the form. Cards and form share the chosen route, ?topic= deep links it, and the email fallback takes it as its subject. Send from error@example.com to see the failure state."
      props={`<ContactPage
  topics={CONTACT_TOPICS}
  location={CONTACT_LOCATION}
  email={CENTRE_EMAIL}
  replyTime="We reply within two working days."
  form={<ContactForm onSend={mockContactService.send} />}
/>`}
    >
      <ContactPage
        topics={CONTACT_TOPICS}
        location={CONTACT_LOCATION}
        email={CENTRE_EMAIL}
        replyTime="We reply within two working days."
        form={<ContactForm onSend={mockContactService.send} />}
      />
    </DemoFrame>
  );
}
