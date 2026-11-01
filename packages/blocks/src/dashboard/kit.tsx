"use client";

import { BrandShape, PhotoBackdrop, ResearchGlyph, cn } from "@gmhlab/ui";
import { Lock } from "lucide-react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import {
  type ComponentProps,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ModuleArt } from "./dashboard-types";
import "./dashboard.css";

/* ── Motion presets ───────────────────────────────────────────────────── */

export const EASE = [0.22, 1, 0.36, 1] as const;

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export const rise: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
};

/** A container whose `Item` children rise in one after another. */
export function Stagger({ className, children, ...props }: ComponentProps<typeof motion.div>) {
  return (
    <motion.div className={className} variants={stagger} initial="hidden" animate="show" {...props}>
      {children}
    </motion.div>
  );
}

export function Item({ className, children, ...props }: ComponentProps<typeof motion.div>) {
  return (
    <motion.div className={className} variants={rise} {...props}>
      {children}
    </motion.div>
  );
}

/* ── Surfaces ─────────────────────────────────────────────────────────── */

export function Panel({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("dash-panel p-6", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * A card that tilts toward the pointer with a glare that follows it.
 * Flat under reduced motion.
 */
export function TiltCard({
  className,
  children,
  max = 7,
  ...props
}: ComponentProps<typeof motion.div> & { max?: number }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [max, -max]), { stiffness: 220, damping: 20 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-max, max]), { stiffness: 220, damping: 20 });

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    x.set(px);
    y.set(py);
    event.currentTarget.style.setProperty("--mx", `${px * 100}%`);
    event.currentTarget.style.setProperty("--my", `${py * 100}%`);
  };
  const onLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      className={cn("dash-tilt", className)}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={reduce ? undefined : onMove}
      onPointerLeave={onLeave}
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export type ArtTone = "navy" | "gold" | "sky";

/** A module's glyph or shape on a lit, contoured tile. */
export function ArtTile({
  art,
  tone = "navy",
  size = 64,
  className,
}: {
  art: ModuleArt;
  tone?: ArtTone;
  size?: number;
  className?: string;
}) {
  return (
    <div className={cn("dash-art", className)} data-tone={tone}>
      {art.kind === "glyph" ? (
        <ResearchGlyph name={art.name} size={size} />
      ) : (
        <BrandShape name={art.name} size={size} />
      )}
    </div>
  );
}

/** Deterministic tone per index, so a grid alternates navy/gold/sky. */
export const toneAt = (i: number): ArtTone => (["navy", "gold", "sky"] as const)[i % 3];

/* ── Data display ─────────────────────────────────────────────────────── */

/** A ring that draws itself to `value` (0–1) when scrolled into view. */
export function ProgressRing({
  value,
  size = 120,
  stroke = 10,
  label,
  sublabel,
  onNavy = false,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: ReactNode;
  sublabel?: ReactNode;
  onNavy?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true });
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const id = `ring-${size}-${stroke}`;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg ref={ref} width={size} height={size} className="-rotate-90" aria-hidden>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--dash-gold-light)" />
            <stop offset="100%" stopColor="var(--dash-gold)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          stroke={onNavy ? "color-mix(in srgb, white 14%, transparent)" : "var(--gmh-color-surface-container-highest)"}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke={`url(#${id})`}
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: inView ? c * (1 - Math.min(1, Math.max(0, value))) : c }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
          style={{ filter: "drop-shadow(0 0 6px color-mix(in srgb, var(--dash-gold) 70%, transparent))" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-2xl font-bold tabular-nums leading-none">{label}</div>
          {sublabel && <div className="mt-1 text-xs opacity-75">{sublabel}</div>}
        </div>
      </div>
    </div>
  );
}

/** Counts up to `to` once in view. Renders the final value on the server. */
export function CountUp({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(to);
  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, { duration: 1.2, ease: EASE, onUpdate: setValue });
    return () => controls.stop();
  }, [inView, reduce, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ── Chrome ───────────────────────────────────────────────────────────── */

export function Chip({
  className,
  tone = "neutral",
  children,
}: {
  className?: string;
  tone?: "neutral" | "gold" | "success" | "info" | "warning" | "navy";
  children: ReactNode;
}) {
  const tones = {
    neutral: "bg-surface-container-high text-on-surface-variant",
    gold: "bg-tertiary-container text-on-tertiary-container",
    success: "bg-success-container text-on-success-container",
    info: "bg-info-container text-on-info-container",
    warning: "bg-warning-container text-on-warning-container",
    navy: "bg-[color-mix(in_srgb,white_14%,transparent)] text-on-brand-band ring-1 ring-white/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * The navy band that opens every module page: eyebrow, serif title, a line of
 * description, actions, and the module's art floating on the right.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  art,
  backdrop,
  actions,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Drawn as an ornament cropped off the hero's bottom-right corner. */
  art?: ModuleArt;
  /**
   * A photograph across the whole hero, in the brand duotone under a navy
   * wash that keeps the copy at reading strength and opens to the right.
   */
  backdrop?: { src: string; position?: string };
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <motion.section
      className={cn("dash-hero px-6 py-9 sm:px-10 sm:py-12", backdrop && "dash-hero-photo sm:py-16")}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {backdrop && <PhotoBackdrop src={backdrop.src} position={backdrop.position} />}
      <div className="dash-aurora" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      {art && !backdrop && (
        <motion.div
          className="pointer-events-none absolute -bottom-[38%] right-[-4%] -z-[1] hidden aspect-square w-[min(44%,26rem)] md:block"
          initial={{ opacity: 0, rotate: -14, y: 30 }}
          animate={{ opacity: art.kind === "shape" ? 0.55 : 0.22, rotate: -6, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
          aria-hidden
        >
          {art.kind === "shape" ? (
            <BrandShape name={art.name} className="size-full" />
          ) : (
            <ResearchGlyph name={art.name} className="size-full" />
          )}
        </motion.div>
      )}
      <div className="relative">
        <div className="max-w-2xl">
          {eyebrow && (
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-band-accent">
              {eyebrow}
            </div>
          )}
          <h1 className="font-serif text-3xl leading-tight sm:text-[2.6rem]">{title}</h1>
          {description && <p className="mt-3 max-w-xl text-base/relaxed opacity-85">{description}</p>}
          {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
          {children}
        </div>
      </div>
    </motion.section>
  );
}

export function SectionTitle({
  title,
  description,
  action,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-serif text-xl">{title}</h2>
        {description && <p className="mt-1 text-sm text-on-surface-variant">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/** "Demo content" disclosure — used wherever copy is invented. */
export function DemoNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-low px-4 py-3 text-xs text-on-surface-variant">
      {children}
    </p>
  );
}

export function LockBadge({ hint }: { hint: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant">
      <Lock className="size-3.5" aria-hidden />
      {hint}
    </span>
  );
}

/* ── Celebration ──────────────────────────────────────────────────────── */

const CONFETTI = Array.from({ length: 46 }, (_, i) => i);

/**
 * A burst of gold and navy confetti over the viewport. Mount it to fire;
 * renders nothing under reduced motion.
 */
export function Confetti({ onDone }: { onDone?: () => void }) {
  const reduce = useReducedMotion();
  useEffect(() => {
    const t = setTimeout(() => onDone?.(), 2600);
    return () => clearTimeout(t);
  }, [onDone]);
  if (reduce) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden" aria-hidden>
      {CONFETTI.map((i) => {
        const left = (i * 37) % 100;
        const colours = ["var(--dash-gold)", "var(--dash-gold-light)", "var(--dash-navy)", "var(--dash-sky)"];
        return (
          <motion.span
            key={i}
            className="absolute top-[-5%] block"
            style={{
              left: `${left}%`,
              width: 6 + (i % 4) * 2,
              height: 10 + (i % 3) * 4,
              background: colours[i % colours.length],
              borderRadius: i % 5 === 0 ? 999 : 2,
            }}
            initial={{ y: 0, rotate: 0, opacity: 1 }}
            animate={{
              y: ["0vh", `${70 + (i % 5) * 8}vh`],
              x: [0, ((i % 7) - 3) * 30],
              rotate: [0, (i % 2 ? 1 : -1) * (180 + i * 12)],
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 1.8 + (i % 6) * 0.15, ease: "easeOut", delay: (i % 10) * 0.03 }}
          />
        );
      })}
    </div>
  );
}
