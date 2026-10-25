import { isEmailAddress } from "@gmhlab/core";
import clsx from "clsx";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type FormEvent,
  type ReactNode,
} from "react";
import { CareRings } from "../../graphics";
import { IconArrowRight } from "../../icons";
import { Button } from "../../primitives";
import "./newsletter-signup.css";

type SignupStatus =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "error"; message: string; invalid: boolean }
  | { state: "done"; email: string };

export type NewsletterSignupProps = Omit<
  ComponentPropsWithoutRef<"section">,
  "title" | "onSubmit"
> & {
  /**
   * Hands the address to the mailing list. Resolve when it is accepted;
   * reject with an `Error` whose message is fit to show the subscriber. In an
   * app on `@gmhlab/data`, pass `useNewsletter().subscribe`.
   */
  onSubscribe: (email: string) => Promise<void>;
  /** Small-caps line over the title. `null` drops it. */
  eyebrow?: ReactNode | null;
  title?: ReactNode;
  /** What the list sends. `null` drops it. */
  description?: ReactNode | null;
  /** The field's visible label. */
  label?: string;
  placeholder?: string;
  submitLabel?: string;
  /**
   * The line under the field — privacy or frequency. None by default: it is
   * a promise about the list, and only its owner can make it.
   */
  fineprint?: ReactNode;
  /** Heading of the confirmation that replaces the form. */
  doneTitle?: ReactNode;
  /** Body of the confirmation. Defaults to naming the address subscribed. */
  doneDescription?: ReactNode;
};

/**
 * A newsletter signup panel for a brand band — built for the footer's
 * `newsletter` slot, though it paints its own navy and works on any surface.
 *
 * One email field, no consent checkbox: typing an address and pressing
 * Subscribe is the consent. The address is checked loosely before the round
 * trip, a hidden honeypot field drops naive bots without calling the service,
 * and on success the form gives way to a confirmation that takes focus (the
 * button that had it is gone) while the care rings pulse outward again.
 */
export function NewsletterSignup({
  onSubscribe,
  eyebrow = "Newsletter",
  title = "Stay close to the work.",
  description = "New research, project milestones and publications, sent to your inbox.",
  label = "Email address",
  placeholder = "name@example.org",
  submitLabel = "Subscribe",
  fineprint,
  doneTitle = "You’re on the list.",
  doneDescription,
  className,
  ...props
}: NewsletterSignupProps) {
  const [status, setStatus] = useState<SignupStatus>({ state: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const resetRef = useRef(false);
  const id = useId();
  const titleId = `${id}-title`;
  const inputId = `${id}-email`;
  const messageId = `${id}-message`;

  const submitting = status.state === "submitting";
  const error = status.state === "error" ? status : null;
  const done = status.state === "done";

  // Focus follows the swap: to the confirmation when it replaces the form,
  // back to the field when "use a different address" brings the form back.
  useEffect(() => {
    if (done) doneRef.current?.focus();
    else if (resetRef.current) {
      resetRef.current = false;
      inputRef.current?.focus();
    }
  }, [done]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();

    // A person never sees the trap field; anything that fills it is a bot.
    // It is told it succeeded, so it has no reason to retry.
    if (form.get("website")) {
      setStatus({ state: "done", email });
      return;
    }
    if (!isEmailAddress(email)) {
      setStatus({
        state: "error",
        invalid: true,
        message: email
          ? "That doesn’t look like an email address — check for a typo."
          : "Enter your email address to subscribe.",
      });
      inputRef.current?.focus();
      return;
    }

    setStatus({ state: "submitting" });
    try {
      await onSubscribe(email);
      setStatus({ state: "done", email });
    } catch (err) {
      setStatus({
        state: "error",
        invalid: false,
        message:
          err instanceof Error && err.message
            ? err.message
            : "Something went wrong. Please try again.",
      });
      inputRef.current?.focus();
    }
  }

  function reset() {
    resetRef.current = true;
    setStatus({ state: "idle" });
  }

  return (
    <section
      className={clsx(
        "newsletter graphic-on-brand",
        done && "newsletter-is-done",
        className,
      )}
      aria-labelledby={titleId}
      {...props}
    >
      {/* Re-keyed on success so the rings' mount animation plays again. */}
      <CareRings
        key={done ? "done" : "idle"}
        className="newsletter-rings"
      />
      {done ? (
        <div className="newsletter-done">
          <span className="newsletter-done-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path pathLength={1} d="M5.5 12.5 10 17l8.5-9.5" />
            </svg>
          </span>
          <h2
            id={titleId}
            ref={doneRef}
            tabIndex={-1}
            className="newsletter-title"
          >
            {doneTitle}
          </h2>
          <p className="newsletter-description">
            {doneDescription ?? (
              <>
                We’ll send the next issue to{" "}
                <strong className="newsletter-address">{status.email}</strong>.
              </>
            )}
          </p>
          <button type="button" className="newsletter-reset" onClick={reset}>
            Use a different address
          </button>
        </div>
      ) : (
        <div className="newsletter-body">
          <div className="newsletter-copy">
            {eyebrow && <p className="newsletter-eyebrow">{eyebrow}</p>}
            <h2 id={titleId} className="newsletter-title">
              {title}
            </h2>
            {description && (
              <p className="newsletter-description">{description}</p>
            )}
          </div>
          <form className="newsletter-form" noValidate onSubmit={submit}>
            <label htmlFor={inputId} className="newsletter-label">
              {label}
            </label>
            <div
              className="newsletter-field"
              data-invalid={error?.invalid || undefined}
            >
              <input
                ref={inputRef}
                id={inputId}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                required
                placeholder={placeholder}
                readOnly={submitting}
                aria-invalid={error?.invalid || undefined}
                aria-describedby={error || fineprint ? messageId : undefined}
                onChange={() => error && setStatus({ state: "idle" })}
                className="newsletter-input"
              />
              <Button
                type="submit"
                variant="accent"
                disabled={submitting}
                focusableWhenDisabled
                className="newsletter-submit h-11 rounded-full px-5"
              >
                {/* The spinner takes the arrow's exact box, so the button
                    never resizes and squeezes the address mid-request. */}
                {submitLabel}
                {submitting ? (
                  <>
                    <span className="newsletter-spinner" aria-hidden="true" />
                    <span className="sr-only">, sending</span>
                  </>
                ) : (
                  <IconArrowRight />
                )}
              </Button>
            </div>
            <div className="newsletter-trap" aria-hidden="true">
              <label>
                Leave this field empty
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <p
              id={messageId}
              className={clsx(
                "newsletter-message",
                error && "newsletter-message-error",
              )}
              aria-live="polite"
            >
              {error ? error.message : fineprint}
            </p>
          </form>
        </div>
      )}
    </section>
  );
}
