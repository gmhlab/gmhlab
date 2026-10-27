import { type ContactInquiry, isEmailAddress } from "@gmhlab/core";
import {
  Button,
  IconArrowRight,
  Input,
  Label,
  ResearchGlyph,
  Textarea,
} from "@gmhlab/ui";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { CONTACT_FORM_ID, useContactPage } from "./contact-context";
import { type ContactTopic, contactMailto } from "./contact-types";
import "./contact-form.css";

type Field = "topic" | "name" | "email" | "organization" | "message";
type Errors = Partial<Record<Field, string>>;

type SendStatus =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "failed"; message: string }
  | { state: "sent"; inquiry: ContactInquiry };

/** Validation order is the order the fields appear, so focus lands on the first. */
const FIELD_ORDER: Field[] = ["topic", "name", "email", "organization", "message"];

export type ContactFormProps = {
  /**
   * Delivers the inquiry. Resolve when it is accepted; reject with an `Error`
   * whose message is fit to show the sender. In an app on `@gmhlab/data`,
   * pass `useContact().send`.
   */
  onSend: (inquiry: ContactInquiry) => Promise<void>;
  /**
   * The routes a sender picks from. Inside a `ContactPage` they come from
   * the page; pass them only to use the form on its own.
   */
  topics?: ContactTopic[];
  /** The form's heading. */
  heading?: ReactNode;
  /**
   * When to expect a reply, as a sentence. Inside a `ContactPage` it comes
   * from the page. No default — it is a promise only the inbox's owner can
   * make.
   */
  replyTime?: string;
  /**
   * Where the "email us instead" fallback goes when sending fails. Inside a
   * `ContactPage` it comes from the page.
   */
  email?: string | null;
};

/**
 * The contact form: a route ("I'm reaching out about…"), who is writing, and
 * the message.
 *
 * Picking a route does three things: it marks the matching card on the page,
 * swaps the message field's guidance for that route's own prompt, and makes
 * the organization field required where the route needs one. Validation is
 * per field, on submit, with focus sent to the first problem; a hidden
 * honeypot drops naive bots without calling the service. If sending fails,
 * the error offers the same message as a pre-filled email, so nothing typed
 * is lost. On success the form gives way to a confirmation that takes focus.
 */
export function ContactForm({
  onSend,
  topics: topicsProp,
  heading = "Send us a message",
  replyTime: replyTimeProp,
  email: emailProp,
}: ContactFormProps) {
  const page = useContactPage();
  const topics = topicsProp ?? page?.topics ?? [];
  const replyTime = replyTimeProp ?? page?.replyTime;
  const email = emailProp !== undefined ? emailProp : (page?.email ?? null);

  // The page owns the topic when there is one, so its cards and this form
  // stay in step; on its own, the form keeps it.
  const [localTopic, setLocalTopic] = useState("");
  const topicId = page ? page.topic : localTopic;
  const setTopicId = page ? page.setTopic : setLocalTopic;
  const topic = topics.find((t) => t.id === topicId) ?? null;
  const organizationRequired = topic?.organization === "required";

  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<SendStatus>({ state: "idle" });
  const formRef = useRef<HTMLFormElement>(null);
  const sentRef = useRef<HTMLHeadingElement>(null);
  const resetRef = useRef(false);

  const id = useId();
  const ids = {
    heading: `${id}-heading`,
    topic: `${id}-topic`,
    name: `${id}-name`,
    email: `${id}-email`,
    organization: `${id}-organization`,
    message: `${id}-message`,
    prompt: `${id}-prompt`,
    status: `${id}-status`,
  };

  const sending = status.state === "sending";
  const sent = status.state === "sent" ? status.inquiry : null;

  useEffect(() => {
    if (sent) sentRef.current?.focus();
    else if (resetRef.current) {
      resetRef.current = false;
      formRef.current
        ?.querySelector<HTMLElement>('input[name="name"]')
        ?.focus();
    }
  }, [sent]);

  function clearError(field: Field) {
    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
    if (status.state === "failed") setStatus({ state: "idle" });
  }

  function validate(form: FormData): Errors {
    const value = (key: Field) => String(form.get(key) ?? "").trim();
    const next: Errors = {};
    if (!topic) next.topic = "Choose what you’re reaching out about.";
    if (!value("name")) next.name = "Enter your name.";
    const address = value("email");
    if (!address) next.email = "Enter your email address so we can reply.";
    else if (!isEmailAddress(address))
      next.email = "That doesn’t look like an email address — check for a typo.";
    if (organizationRequired && !value("organization"))
      next.organization =
        "Tell us which organization you’re with — we need it to act on this request.";
    if (!value("message")) next.message = "Write a message.";
    return next;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const form = new FormData(event.currentTarget);
    const inquiry: ContactInquiry = {
      topic: topicId,
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      organization: String(form.get("organization") ?? "").trim(),
      message: String(form.get("message") ?? "").trim(),
    };

    // A person never sees the trap field; anything that fills it is a bot,
    // and is told it succeeded so it has no reason to retry.
    if (form.get("website")) {
      setStatus({ state: "sent", inquiry });
      return;
    }

    const found = validate(form);
    setErrors(found);
    const first = FIELD_ORDER.find((field) => found[field]);
    if (first) {
      const target =
        first === "topic"
          ? formRef.current?.querySelector<HTMLElement>('input[name="topic"]')
          : formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
      target?.focus();
      return;
    }

    setStatus({ state: "sending" });
    try {
      await onSend(inquiry);
      setStatus({ state: "sent", inquiry });
    } catch (err) {
      setStatus({
        state: "failed",
        message:
          err instanceof Error && err.message
            ? err.message
            : "Something went wrong. Please try again.",
      });
    }
  }

  function reset() {
    resetRef.current = true;
    setErrors({});
    setStatus({ state: "idle" });
  }

  if (sent) {
    const sentTopic = topics.find((t) => t.id === sent.topic);
    const firstName = sent.name.split(/\s+/)[0];
    return (
      <section
        className="contact-form contact-form-is-sent"
        aria-labelledby={ids.heading}
      >
        <div className="contact-sent">
          <span className="contact-sent-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path pathLength={1} d="M5.5 12.5 10 17l8.5-9.5" />
            </svg>
          </span>
          <h2
            id={ids.heading}
            ref={sentRef}
            tabIndex={-1}
            className="contact-form-heading"
          >
            Thank you, {firstName}. Your message is on its way.
          </h2>
          <p className="contact-sent-body">
            {sentTopic ? (
              <>
                It’s filed under <strong>{sentTopic.label}</strong>, and we’ll
                reply to{" "}
              </>
            ) : (
              <>We’ll reply to </>
            )}
            <strong className="contact-sent-address">{sent.email}</strong>.
            {replyTime ? <> {replyTime}</> : null}
          </p>
          {sentTopic?.links?.length ? (
            <div className="contact-sent-next">
              <p className="contact-sent-next-label">While you wait</p>
              <ul>
                {sentTopic.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>
                      {link.label}
                      <IconArrowRight />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <button type="button" className="contact-sent-reset" onClick={reset}>
            Send another message
          </button>
        </div>
      </section>
    );
  }

  const describe = (...describedBy: (string | false | undefined)[]) =>
    describedBy.filter(Boolean).join(" ") || undefined;

  return (
    <section className="contact-form" aria-labelledby={ids.heading}>
      <header className="contact-form-header">
        <h2 id={ids.heading} className="contact-form-heading">
          {heading}
        </h2>
        {replyTime ? <p className="contact-form-reply">{replyTime}</p> : null}
      </header>

      <form ref={formRef} noValidate onSubmit={submit}>
        <fieldset
          className="contact-topics"
          aria-describedby={errors.topic ? `${ids.topic}-error` : undefined}
          aria-invalid={errors.topic ? true : undefined}
        >
          <legend className="contact-label">I’m reaching out about…</legend>
          <div className="contact-topic-options">
            {topics.map((option) => (
              <label key={option.id} className="contact-topic-option">
                <input
                  type="radio"
                  name="topic"
                  value={option.id}
                  checked={topicId === option.id}
                  onChange={() => {
                    setTopicId(option.id);
                    clearError("topic");
                  }}
                  disabled={sending}
                />
                <span className="contact-topic-chip">
                  <ResearchGlyph name={option.glyph} size={22} />
                  {option.label}
                </span>
              </label>
            ))}
          </div>
          <FieldError id={`${ids.topic}-error`} message={errors.topic} />
        </fieldset>

        <div className="contact-fields">
          <div className="contact-field">
            <Label htmlFor={ids.name} className="contact-label">
              Name
            </Label>
            <Input
              id={ids.name}
              name="name"
              autoComplete="name"
              required
              readOnly={sending}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={describe(errors.name && `${ids.name}-error`)}
              onChange={() => clearError("name")}
              className="contact-input"
            />
            <FieldError id={`${ids.name}-error`} message={errors.name} />
          </div>

          <div className="contact-field">
            <Label htmlFor={ids.email} className="contact-label">
              Email
            </Label>
            <Input
              id={ids.email}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              required
              readOnly={sending}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={describe(errors.email && `${ids.email}-error`)}
              onChange={() => clearError("email")}
              className="contact-input"
            />
            <FieldError id={`${ids.email}-error`} message={errors.email} />
          </div>

          <div className="contact-field contact-field-wide">
            <Label htmlFor={ids.organization} className="contact-label">
              Organization
              {organizationRequired ? null : (
                <span className="contact-label-note">Optional</span>
              )}
            </Label>
            <Input
              id={ids.organization}
              name="organization"
              autoComplete="organization"
              required={organizationRequired}
              readOnly={sending}
              placeholder="University, ministry, NGO or outlet"
              aria-invalid={errors.organization ? true : undefined}
              aria-describedby={describe(
                errors.organization && `${ids.organization}-error`,
              )}
              onChange={() => clearError("organization")}
              className="contact-input"
            />
            <FieldError
              id={`${ids.organization}-error`}
              message={errors.organization}
            />
          </div>

          <div className="contact-field contact-field-wide">
            <Label htmlFor={ids.message} className="contact-label">
              Message
            </Label>
            {/* Re-keyed so the guidance fades in fresh when the route changes. */}
            <p key={topicId} id={ids.prompt} className="contact-prompt">
              {topic?.prompt ??
                "Choose a topic above and we’ll suggest what to include."}
            </p>
            <Textarea
              id={ids.message}
              name="message"
              rows={6}
              required
              readOnly={sending}
              placeholder={topic ? "Write your message" : undefined}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={describe(
                ids.prompt,
                errors.message && `${ids.message}-error`,
              )}
              onChange={() => clearError("message")}
              className="contact-textarea"
            />
            <FieldError id={`${ids.message}-error`} message={errors.message} />
          </div>
        </div>

        <div className="contact-trap" aria-hidden="true">
          <label>
            Leave this field empty
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div id={ids.status} aria-live="polite">
          {status.state === "failed" ? (
            <div className="contact-failed" role="alert">
              <p>{status.message}</p>
              {email ? (
                <a
                  href={contactMailto(
                    email,
                    topic,
                    String(
                      new FormData(formRef.current ?? undefined).get("message") ??
                        "",
                    ),
                  )}
                >
                  Email your message to {email} instead
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="contact-form-footer">
          <Button
            type="submit"
            size="lg"
            disabled={sending}
            focusableWhenDisabled
            className="contact-submit"
          >
            {sending ? "Sending" : "Send message"}
            {sending ? (
              <>
                <span className="contact-spinner" aria-hidden="true" />
                <span className="sr-only">…</span>
              </>
            ) : (
              <IconArrowRight />
            )}
          </Button>
          {topic ? (
            <p className="contact-route" aria-live="polite">
              <ResearchGlyph name={topic.glyph} size={20} />
              <span>
                Filed under <strong>{topic.label}</strong>
              </span>
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="contact-error">
      {message}
    </p>
  );
}

/** `#contact-form` — exported for pages that link to the form from elsewhere. */
export { CONTACT_FORM_ID };
