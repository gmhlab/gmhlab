import {
  BrandShape,
  type BrandShapeName,
  ResearchGlyph,
  type ResearchGlyphName,
  cn,
} from "@gmhlab/ui";
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
  useEffect,
  useRef,
  useState,
} from "react";
import "./lit.css";

/**
 * The lit language's components — shared by the member workspace and the
 * public page blocks. The styles are `lit.css`; see its header.
 *
 * Two kinds of motion live here, for two kinds of page:
 * - `Stagger`/`Item` animate on mount with motion's variants. Their hidden
 *   state is in the server HTML, so use them only where nothing is
 *   server-rendered (the workspace renders after the session restores).
 * - `useLitReveal` is the public pages' scroll reveal: CSS-driven, and the
 *   hidden state is switched on only after mount, with anything already on
 *   screen marked in first — server HTML and no-JS readers see everything,
 *   and the first paint never blinks.
 */

/** A graphics-kit drawing: a research glyph or a duotone brand shape. */
export type LitArt =
  | { kind: "glyph"; name: ResearchGlyphName }
  | { kind: "shape"; name: BrandShapeName };

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

/** A container whose `Item` children rise in one after another. Client-rendered pages only. */
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

/**
 * Scroll reveal for every `.lit-reveal` under the returned ref: each rises
 * in (with the workspace's soft blur) as it scrolls into view. Siblings
 * that arrive together stagger by their `--lit-i` index when one is set.
 *
 * Elements on screen at mount are marked in BEFORE the hidden state is
 * switched on, so the server-rendered first paint never disappears. Off
 * under `prefers-reduced-motion`.
 */
export function useLitReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(".lit-reveal"));
    const below = items.filter((el) => {
      const inView = el.getBoundingClientRect().top < window.innerHeight;
      if (inView) el.classList.add("is-in");
      return !inView;
    });
    root.dataset.litReveal = "";
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -60px" },
    );
    below.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ── Surfaces ─────────────────────────────────────────────────────────── */

/** Three blurred brand lights orbiting slowly behind a lit hero's copy. */
export function Aurora({ className }: { className?: string }) {
  return (
    <div className={cn("lit-aurora", className)} aria-hidden>
      <span />
      <span />
      <span />
    </div>
  );
}

export function Panel({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("lit-panel p-6", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * A card that tilts toward the pointer with a glare that follows it.
 * Flat under reduced motion. Renders its children as-is on the server.
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
      className={cn("lit-tilt", className)}
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

/** A glyph or shape on a lit, contoured tile. */
export function ArtTile({
  art,
  tone = "navy",
  size = 64,
  className,
}: {
  art: LitArt;
  tone?: ArtTone;
  size?: number;
  className?: string;
}) {
  return (
    <div className={cn("lit-art", className)} data-tone={tone}>
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
