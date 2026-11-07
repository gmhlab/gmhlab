import type { Credentials, Registration } from "@gmhlab/core";
import { Button, ContourGlobe, GmhLogo, cn } from "@gmhlab/ui";
import { ArrowLeft, ArrowRight, Eye, EyeOff, GraduationCap, Palette, Users } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { type FormEvent, type ReactNode, useState } from "react";
import { GMH_DASHBOARD_COPY } from "../shared/gmh-copy";
import type { DemoAccountOption } from "./dashboard-shell";
import { EASE } from "./kit";
import "./dashboard.css";

export type AuthMode = "signin" | "signup";

export type AuthScreenProps = {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  /** Resolve on success; reject with a message to show. */
  onSignIn: (credentials: Credentials) => Promise<void>;
  onRegister: (registration: Registration) => Promise<void>;
  /** One-click demo sign-ins. Omit in production. */
  demoAccounts?: DemoAccountOption[];
  demoPassword?: string;
  /** Back link to the public site. */
  siteHref?: string;
  headline?: string;
  body?: string;
  /** What an account opens, as short lines under the headline. Pass [] to drop. */
  highlights?: { icon: "training" | "brand" | "projects"; label: string }[];
  /** Extra copy under the form (terms, privacy). */
  footer?: ReactNode;
};

const HIGHLIGHT_ICONS = { training: GraduationCap, brand: Palette, projects: Users };

const DEFAULT_HIGHLIGHTS: NonNullable<AuthScreenProps["highlights"]> = [
  { icon: "training", label: "EQUIP Academy courses" },
  { icon: "brand", label: "Brand, slide and graphics studios" },
  { icon: "projects", label: "Project rooms for partners" },
];

function Field({
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
  hint,
  trailing,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  hint?: string;
  trailing?: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between text-sm font-semibold">
        {label}
        {hint && <span className="text-xs font-normal text-on-surface-variant">{hint}</span>}
      </span>
      <span className="relative block">
        <input
          type={type}
          value={value}
          required
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 text-base outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
        />
        {trailing && <span className="absolute inset-y-0 right-1.5 flex items-center">{trailing}</span>}
      </span>
    </label>
  );
}

/**
 * Sign in and open sign-up on one split screen. Left (desktop): the brand
 * panel — the GMH mark at the heart of the kit's contour field on flat navy,
 * then the headline and what an account opens. Right: the form, with demo
 * sign-ins when given. Below 1024px the panel collapses to a navy header.
 */
export function AuthScreen({
  mode,
  onModeChange,
  onSignIn,
  onRegister,
  demoAccounts,
  demoPassword,
  siteHref = "/",
  headline = GMH_DASHBOARD_COPY.authHeadline,
  body = GMH_DASHBOARD_COPY.authBody,
  highlights = DEFAULT_HIGHLIGHTS,
  footer,
}: AuthScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (task: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await task();
    } catch (err) {
      setError(err instanceof Error ? err.message : "That didn't work. Try again.");
      setBusy(false);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    void run(() => (mode === "signin" ? onSignIn({ email, password }) : onRegister({ name, email, password })));
  };

  const switchTo = (m: AuthMode) => {
    setError(null);
    onModeChange(m);
  };

  const wordmark = (
    <div className="dash-sidebar-brand flex items-center gap-3">
      <GmhLogo href={siteHref} />
      <span className="flex flex-col gap-0.5 leading-none">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-band-accent">
          {GMH_DASHBOARD_COPY.workspaceEyebrow}
        </span>
        <span className="font-serif text-lg leading-none">{GMH_DASHBOARD_COPY.workspaceName}</span>
      </span>
    </div>
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="dash grid min-h-screen lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        {/* ── Brand panel (desktop) ── */}
        <aside className="dash-auth-art sticky top-0 hidden h-screen flex-col overflow-hidden lg:flex">
          <div className="relative z-10 flex items-center justify-between px-12 pt-10">
            {wordmark}
            <a
              href={siteHref}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold opacity-80 transition hover:bg-white/10 hover:opacity-100"
            >
              <ArrowLeft className="size-4" aria-hidden /> Back to the site
            </a>
          </div>

          {/* The banner: the mark at the centre of the contour field. The
              artwork is 1440×640 with the mark centred 75% across and 48%
              down, so the box is offset by those fractions of its own size.
              Its width is capped by the viewport height too, so the mark
              never crowds the wordmark or the copy on a short screen. */}
          <div className="dash-auth-banner pointer-events-none relative min-h-0 flex-1" aria-hidden>
            <motion.div
              className="dash-auth-banner-art"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: EASE }}
            >
              <ContourGlobe centerpiece="mark" className="graphic-on-brand" />
            </motion.div>
          </div>

          <motion.div
            className="relative z-10 px-12 pb-12"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          >
            <h1 className="max-w-xl font-serif text-4xl leading-[1.15] xl:text-[2.75rem]">{headline}</h1>
            <p className="mt-4 max-w-lg text-base/relaxed opacity-80">{body}</p>
            {highlights.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-2">
                {highlights.map((h) => {
                  const Icon = HIGHLIGHT_ICONS[h.icon];
                  return (
                    <li
                      key={h.label}
                      className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3.5 py-2 text-sm ring-1 ring-white/15"
                    >
                      <Icon className="size-4 text-brand-band-accent" aria-hidden />
                      {h.label}
                    </li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        </aside>

        {/* ── Form ── */}
        <main className="flex flex-col">
          <header className="dash-auth-art flex items-center justify-between px-6 py-5 lg:hidden">
            {wordmark}
            <a href={siteHref} className="text-sm font-semibold opacity-85 hover:opacity-100">
              Back to the site
            </a>
          </header>

          <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12">
            <motion.div
              className="w-full max-w-[26rem]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: EASE }}
                >
                  <h2 className="font-serif text-[2rem] leading-tight">
                    {mode === "signin" ? "Welcome back" : "Create your account"}
                  </h2>
                  <p className="mt-2 text-on-surface-variant">
                    {mode === "signin" ? "New here? " : "Already have an account? "}
                    <button
                      type="button"
                      onClick={() => switchTo(mode === "signin" ? "signup" : "signin")}
                      className="font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      {mode === "signin" ? "Create a free account" : "Sign in"}
                    </button>
                  </p>

                  <form onSubmit={submit} className="mt-8 space-y-4">
                    {mode === "signup" && <Field label="Full name" value={name} onChange={setName} autoComplete="name" />}
                    <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
                    <Field
                      label="Password"
                      type={show ? "text" : "password"}
                      value={password}
                      onChange={setPassword}
                      hint={mode === "signup" ? "At least 4 characters" : undefined}
                      autoComplete={mode === "signin" ? "current-password" : "new-password"}
                      trailing={
                        <button
                          type="button"
                          onClick={() => setShow((s) => !s)}
                          className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high"
                          aria-label={show ? "Hide password" : "Show password"}
                        >
                          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      }
                    />
                    <AnimatePresence>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container"
                          role="alert"
                        >
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={busy}>
                      {busy ? "One moment…" : mode === "signin" ? "Sign in" : "Create account"}
                      {!busy && <ArrowRight aria-hidden />}
                    </Button>
                    {mode === "signup" && (
                      <p className="text-center text-xs text-on-surface-variant">
                        Every account starts as a member. Partners and staff are approved from your profile.
                      </p>
                    )}
                  </form>
                </motion.div>
              </AnimatePresence>

              {demoAccounts && demoPassword && (
                <div className="mt-10 rounded-2xl border border-outline-variant/70 bg-surface-container-low p-4">
                  <div className="mb-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Demo — sign in as
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {demoAccounts.map((a) => (
                      <button
                        key={a.email}
                        type="button"
                        disabled={busy}
                        onClick={() => run(() => onSignIn({ email: a.email, password: demoPassword }))}
                        className={cn(
                          "group flex items-center justify-between gap-2 rounded-xl bg-surface-container-lowest px-3 py-2.5 text-left text-sm font-semibold ring-1 ring-outline-variant/70 transition",
                          "hover:ring-primary disabled:opacity-60",
                        )}
                      >
                        <span className="min-w-0">
                          <span className="block truncate">{a.label}</span>
                          {a.role && <span className="block text-xs font-normal text-on-surface-variant">{a.role}</span>}
                        </span>
                        <ArrowRight
                          className="size-3.5 text-on-surface-variant transition group-hover:translate-x-0.5 group-hover:text-primary"
                          aria-hidden
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {footer && <div className="mt-8 text-xs text-on-surface-variant">{footer}</div>}
            </motion.div>
          </div>
        </main>
      </div>
    </MotionConfig>
  );
}
