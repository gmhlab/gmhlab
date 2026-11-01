import {
  type Account,
  type LearningProgress,
  type PlanSku,
  type PricingPlan,
  type PricingPlans,
  canAccess,
  courseCompletion,
  planAtLeast,
} from "@gmhlab/core";
import { Button, ContourGlobe, GmhLogo, Image, PhotoBackdrop, cn } from "@gmhlab/ui";
import { ArrowRight, Check, ShoppingBag, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { GMH_DASHBOARD_COPY } from "../shared/gmh-copy";
import {
  type Course,
  type DashboardAnnouncement,
  type DashboardEvent,
  type DashboardLinkComponent,
  type DashboardModule,
  TIER_LABEL,
  unlockHint,
} from "./dashboard-types";
import { ModuleIconGlyph } from "./dashboard-shell";
import { Cover, FigureRule, LessonPath, Ornament, WaveRule } from "./ornaments";
import {
  ArtTile,
  Chip,
  CountUp,
  EASE,
  Item,
  LockBadge,
  Panel,
  ProgressRing,
  SectionTitle,
  Stagger,
  TiltCard,
  toneAt,
} from "./kit";

const PlainLink: DashboardLinkComponent = ({ href, children, ...props }) => (
  <a href={href} {...props}>
    {children}
  </a>
);

export type DashboardHomeProps = {
  account: Account;
  modules: DashboardModule[];
  courses: Course[];
  progress: LearningProgress;
  /** Where each course lives: `${coursesPath}/${course.id}`. */
  coursesPath: string;
  plans: PricingPlans;
  announcements?: DashboardAnnouncement[];
  events?: DashboardEvent[];
  /** Module ids already in the cart. */
  cartIds: string[];
  onAddToCart: (moduleId: string) => void;
  /** Resolves when the plan is active; rejects with a message to show. */
  onChoosePlan: (plan: PricingPlan) => Promise<void>;
  linkComponent?: DashboardLinkComponent;
  storeNote?: string | null;
  /**
   * A photograph across the whole hero, in the brand duotone under a navy
   * wash (copy on the left stays at reading strength). Decorative.
   */
  heroPhoto?: { src: string; position?: string };
};

function greeting(date = new Date()) {
  const h = date.getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

/**
 * The workspace home: a lit navy hero with the account's learning progress,
 * the courses to continue, every module as a tilt tile (locked ones say what
 * unlocks them), the storefront — plans and buyable add-ons — and the
 * noticeboard.
 */
export function DashboardHome({
  account,
  modules,
  courses,
  progress,
  coursesPath,
  plans,
  announcements = [],
  events = [],
  cartIds,
  onAddToCart,
  onChoosePlan,
  linkComponent: Link = PlainLink,
  storeNote = GMH_DASHBOARD_COPY.storeNote,
  heroPhoto,
}: DashboardHomeProps) {
  const stats = useMemo(() => {
    const open = courses.filter((c) => canAccess(account, c));
    const lessons = open.reduce((n, c) => n + c.lessons.length, 0);
    const done = open.reduce((n, c) => n + (progress[c.id]?.completed.length ?? 0), 0);
    return {
      completion: lessons ? done / lessons : 0,
      done,
      lessons,
      certificates: Object.values(progress).filter((p) => p.certifiedAt).length,
      unlocked: modules.filter((m) => !m.soon && canAccess(account, m)).length,
      available: modules.filter((m) => !m.soon).length,
    };
  }, [account, courses, modules, progress]);

  const continuing = useMemo(
    () =>
      courses
        .filter((c) => canAccess(account, c))
        .map((c) => ({ course: c, value: courseCompletion(progress[c.id], c.lessons.length) }))
        .sort((a, b) => Number(b.value > 0 && b.value < 1) - Number(a.value > 0 && a.value < 1))
        .slice(0, 3),
    [account, courses, progress],
  );

  const firstName = account.name.split(" ")[0];

  return (
    <div className="space-y-12">
      {/* ── Hero ── */}
      <motion.section
        className={cn("dash-hero px-6 py-8 sm:px-10 sm:py-12", heroPhoto && "dash-hero-photo sm:py-16")}
        initial={{ opacity: 0, y: 16, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        {heroPhoto && <PhotoBackdrop src={heroPhoto.src} position={heroPhoto.position} />}
        {heroPhoto && (
          /* The kit's contour striations across the navy behind the copy,
             fading out before the people in the photo. No centrepiece: the
             mark heads the copy instead (the lockup below). */
          <motion.div
            className="dash-hero-striations"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
          >
            <ContourGlobe centerpiece="none" />
          </motion.div>
        )}
        <div className="dash-aurora" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            {/* The lockup: the GMH mark, a hairline separator, then a stack of
                the role chips, the greeting and the lead line — the mark set
                beside the copy the way a logo sits beside a letterhead. */}
            <motion.div
              className="dash-hero-lockup flex items-center gap-5 sm:gap-7"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <div className="hidden shrink-0 sm:block">
                <GmhLogo />
              </div>
              <span className="hidden w-px self-stretch bg-gradient-to-b from-transparent via-white/35 to-transparent sm:block" aria-hidden />
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap gap-2">
                  <Chip tone="navy">{TIER_LABEL[account.tier]}</Chip>
                  {account.plan && account.plan !== "member" && (
                    <Chip tone="navy">
                      <Sparkles className="size-3" aria-hidden /> {account.plan === "practitioner" ? "Practitioner" : "Institution"} plan
                    </Chip>
                  )}
                </div>
                {/* Type and spacing from the tokens only: M3 display and body
                    roles (their own line heights), one space step between. */}
                <h1 className="type-display-small sm:type-display-medium">
                  {greeting()}, <span className="dash-gold-text">{firstName}</span>.
                </h1>
                <p className="mt-1 max-w-xl type-body-large opacity-85">
                  {stats.done === 0
                    ? "Start with the foundations course, or make something on-brand in the studios."
                    : `You've finished ${stats.done} of ${stats.lessons} lessons. Pick up where you left off below.`}
                </p>
              </div>
            </motion.div>
            <div className={cn("mt-8 grid max-w-lg grid-cols-3 gap-3", heroPhoto && "max-w-2xl sm:grid-cols-4")}>
              {heroPhoto && (
                <motion.div
                  className="col-span-3 flex items-center gap-3 rounded-2xl bg-white/8 p-3 ring-1 ring-white/12 backdrop-blur-sm sm:col-span-1"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
                >
                  <ProgressRing
                    value={stats.completion}
                    size={64}
                    stroke={6}
                    onNavy
                    label={<span className="text-sm">{Math.round(stats.completion * 100)}%</span>}
                  />
                  <div className="text-xs leading-tight opacity-75">of your courses</div>
                </motion.div>
              )}
              {[
                { label: "Lessons done", value: stats.done },
                { label: "Certificates", value: stats.certificates },
                { label: "Modules open", value: stats.unlocked, suffix: `/${stats.available}` },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  className="rounded-2xl bg-white/8 p-4 ring-1 ring-white/12 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.08, duration: 0.5, ease: EASE }}
                >
                  <div className="font-serif text-3xl">
                    <CountUp to={s.value} />
                    {s.suffix && <span className="text-lg opacity-60">{s.suffix}</span>}
                  </div>
                  <div className="mt-1 text-xs opacity-75">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
          {!heroPhoto && (
            <div className="mx-auto lg:mx-0">
              <ProgressRing
                value={stats.completion}
                size={168}
                stroke={12}
                onNavy
                label={`${Math.round(stats.completion * 100)}%`}
                sublabel="of your courses"
              />
            </div>
          )}
        </div>
      </motion.section>

      <WaveRule className="h-10" />

      {/* ── Continue learning ── */}
      {continuing.length > 0 && (
        <section>
          <SectionTitle
            title="Continue learning"
            description="Your courses, in-progress first."
            action={
              <Link href={coursesPath} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                All courses <ArrowRight className="size-4" aria-hidden />
              </Link>
            }
          />
          <Stagger className="grid gap-5 md:grid-cols-3">
            {continuing.map(({ course, value }, i) => (
              <Item key={course.id}>
                <Link href={`${coursesPath}/${course.id}`} className="block h-full">
                  <TiltCard className="dash-panel group relative isolate flex h-full flex-col gap-4 overflow-hidden p-5">
                    {course.image && (
                      <div className="dash-card-photo" aria-hidden>
                        <Image src={course.image} alt="" treatment="duotone" aspectRatio="fill" variant="default" className="!h-full" />
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <ArtTile art={{ kind: "glyph", name: course.glyph }} tone={toneAt(i)} size={34} className="size-14 shrink-0 !rounded-2xl shadow-level2" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{course.level}</div>
                        <div className="font-semibold leading-snug">{course.title}</div>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <div className="mb-1.5 flex justify-between text-xs text-on-surface-variant">
                        <span>{value === 1 ? "Complete" : value === 0 ? "Not started" : "In progress"}</span>
                        <span className="tabular-nums">{Math.round(value * 100)}%</span>
                      </div>
                      <LessonPath total={course.lessons.length} done={Math.round(value * course.lessons.length)} />
                    </div>
                  </TiltCard>
                </Link>
              </Item>
            ))}
          </Stagger>
        </section>
      )}

      {/* ── Modules ── */}
      <section>
        <SectionTitle title="Your modules" description="Everything in the workspace. Locked tiles say what opens them." />
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {modules.map((m, i) => {
            const open = canAccess(account, m) && !m.soon;
            const tile = (
              <TiltCard
                className={cn("dash-panel flex h-full flex-col p-4", !open && "opacity-90")}
                max={open ? 7 : 3}
              >
                <Cover
                  art={m.art}
                  tone={toneAt(i)}
                  badge={<ModuleIconGlyph icon={m.icon} className="size-5" />}
                  className={cn("aspect-[16/10] w-full", !open && "grayscale-[0.45]")}
                />
                <div className="mt-4 flex items-start justify-between gap-2">
                  <div className="font-semibold leading-snug">{m.title}</div>
                  {m.soon && <Chip tone="info">Soon</Chip>}
                </div>
                <p className="mt-1 text-sm text-on-surface-variant">{m.tagline}</p>
                <div className="mt-auto pt-4">
                  {open ? (
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      Open <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden />
                    </span>
                  ) : (
                    !m.soon && <LockBadge hint={unlockHint(m)} />
                  )}
                </div>
              </TiltCard>
            );
            return (
              <Item key={m.id} className="group">
                {m.soon ? tile : <Link href={m.href} className="block h-full">{tile}</Link>}
              </Item>
            );
          })}
        </Stagger>
      </section>

      {/* ── Store ── */}
      <FigureRule className="opacity-80" />
      <Storefront
        account={account}
        modules={modules}
        plans={plans}
        cartIds={cartIds}
        onAddToCart={onAddToCart}
        onChoosePlan={onChoosePlan}
        note={storeNote}
      />

      <WaveRule className="h-10" />

      {/* ── Noticeboard ── */}
      {(announcements.length > 0 || events.length > 0) && (
        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          {announcements.length > 0 && (
            <div>
              <SectionTitle title="What's new" />
              <Stagger className="space-y-3">
                {announcements.map((a) => {
                  const body = (
                    <Panel className="flex items-start gap-4 p-5 transition hover:-translate-y-0.5">
                      <Chip tone="gold">{a.label}</Chip>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold">{a.title}</div>
                        <p className="mt-1 text-sm text-on-surface-variant">{a.body}</p>
                      </div>
                      {a.href && <ArrowRight className="mt-1 size-4 shrink-0 text-on-surface-variant" aria-hidden />}
                    </Panel>
                  );
                  return (
                    <Item key={a.id}>
                      {a.href ? (
                        <Link href={a.href} className="block">
                          {body}
                        </Link>
                      ) : (
                        body
                      )}
                    </Item>
                  );
                })}
              </Stagger>
            </div>
          )}
          {events.length > 0 && (
            <div>
              <SectionTitle title="Coming up" />
              <Panel className="space-y-1 p-3">
                {events.map((e) => {
                  const d = new Date(`${e.date}T12:00:00`);
                  return (
                    <div key={e.id} className="flex items-center gap-4 rounded-2xl p-2 hover:bg-surface-container">
                      <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand-band text-on-brand-band">
                        <div className="text-center leading-none">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-brand-band-accent">
                            {d.toLocaleDateString("en-US", { month: "short" })}
                          </div>
                          <div className="font-serif text-xl">{d.getDate()}</div>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold">{e.title}</div>
                        <div className="text-sm text-on-surface-variant">{e.detail}</div>
                      </div>
                    </div>
                  );
                })}
              </Panel>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

/* ── Storefront ───────────────────────────────────────────────────────── */

function Storefront({
  account,
  modules,
  plans,
  cartIds,
  onAddToCart,
  onChoosePlan,
  note,
}: {
  account: Account;
  modules: DashboardModule[];
  plans: PricingPlans;
  cartIds: string[];
  onAddToCart: (id: string) => void;
  onChoosePlan: (plan: PricingPlan) => Promise<void>;
  note: string | null;
}) {
  const [annual, setAnnual] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const list = annual ? plans.annual : plans.monthly;
  const addOns = modules.filter((m) => m.price !== undefined && !m.soon);

  const choose = async (plan: PricingPlan) => {
    setPending(plan.id);
    setError(null);
    try {
      await onChoosePlan(plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : "That didn't go through.");
    } finally {
      setPending(null);
    }
  };

  return (
    <section
      id="store"
      className="relative isolate scroll-mt-24 overflow-hidden rounded-[32px] bg-surface-container-low px-5 py-8 ring-1 ring-outline-variant/50 sm:px-8 sm:py-10"
    >
      <Ornament shape="rising-rings" corner="bottom-left" size={420} strength={0.09} />
      <Ornament shape="seed" corner="top-right" size={300} strength={0.1} />
      <SectionTitle
        title="Plans & store"
        description="Upgrade for every course and template, or buy a single add-on."
        action={
          <div className="relative flex rounded-full bg-surface-container-high p-1 text-sm font-semibold" role="group" aria-label="Billing period">
            {(["Monthly", "Annual"] as const).map((label) => {
              const active = (label === "Annual") === annual;
              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setAnnual(label === "Annual")}
                  className={cn("relative isolate rounded-full px-4 py-1.5 transition", active ? "text-on-primary" : "text-on-surface-variant")}
                >
                  {active && (
                    <motion.span
                      layoutId="dash-billing-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  {label}
                  {label === "Annual" && <span className="ml-1 text-xs opacity-80">−17%</span>}
                </button>
              );
            })}
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {list.map((plan, i) => {
          const sku = plan.sku as PlanSku;
          const current = (account.plan ?? "member") === sku;
          const included = !current && planAtLeast(account, sku);
          const featured = plan.popular;
          return (
            <motion.div
              key={plan.sku}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: EASE }}
              className={cn(
                "relative flex flex-col p-7",
                featured ? "dash-hero lg:-my-3 lg:py-10" : "dash-panel",
              )}
            >
              {featured && (
                <div className="dash-aurora" aria-hidden>
                  <span />
                  <span />
                  <span />
                </div>
              )}
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl">{plan.name}</h3>
                {featured && <Chip tone="navy">Most popular</Chip>}
              </div>
              <p className={cn("mt-2 text-sm", featured ? "opacity-85" : "text-on-surface-variant")}>{plan.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={`${plan.id}-${plan.price}`}
                    className="font-serif text-5xl tabular-nums"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {plan.price === 0 ? "Free" : `${plan.currency}${plan.price}`}
                  </motion.span>
                </AnimatePresence>
                {plan.price > 0 && <span className="opacity-70">/{plan.interval}</span>}
              </div>
              <ul className="mt-6 space-y-2.5 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <Check className={cn("mt-0.5 size-4 shrink-0", featured ? "text-brand-band-accent" : "text-primary")} aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <Button
                  className={cn("w-full", featured && !current && !included && "dash-shine")}
                  variant={featured ? "accent" : current || included ? "outline" : "default"}
                  size="lg"
                  disabled={current || included || pending !== null}
                  onClick={() => choose(plan)}
                >
                  {current ? "Your plan" : included ? "Included" : pending === plan.id ? "Starting…" : `Choose ${plan.name}`}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
      {error && <p className="mt-4 text-sm text-error">{error}</p>}

      {addOns.length > 0 && (
        <div className="mt-10">
          <h3 className="mb-4 font-semibold">Add-ons</h3>
          <div className="grid gap-5 md:grid-cols-2">
            {addOns.map((m, i) => {
              const owned = canAccess(account, m);
              const inCart = cartIds.includes(m.id);
              return (
                <TiltCard key={m.id} className="dash-panel flex gap-5 p-5" max={4}>
                  <Cover art={m.art} tone={toneAt(i + 1)} className="size-28 shrink-0" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold">{m.title}</div>
                        <p className="mt-1 text-sm text-on-surface-variant">{m.description}</p>
                      </div>
                      <div className="font-serif text-2xl tabular-nums">${m.price}</div>
                    </div>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {m.includes.map((inc) => (
                        <li key={inc}>
                          <Chip>{inc}</Chip>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4">
                      <Button
                        size="sm"
                        variant={owned ? "outline" : inCart ? "secondary" : "default"}
                        disabled={owned || inCart}
                        onClick={() => onAddToCart(m.id)}
                      >
                        {owned ? (
                          <>
                            <Check aria-hidden /> You have this
                          </>
                        ) : inCart ? (
                          "In your cart"
                        ) : (
                          <>
                            <ShoppingBag aria-hidden /> Add to cart
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </div>
      )}
      {note && <p className="mt-6 text-center text-xs text-on-surface-variant">{note}</p>}
    </section>
  );
}

