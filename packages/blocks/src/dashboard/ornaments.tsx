import { BrandShape, type BrandShapeName, FigureBand, Image, ResearchGlyph, cn } from "@gmhlab/ui";
import { Camera } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import type { ModuleArt } from "./dashboard-types";

/**
 * The graphics kit used the way the designer's kit file labels it: the
 * duotone shapes as **ornaments** (large, cropped off a corner, behind
 * content) and as **photo frames** (blob, arch, pill, bracket), and the
 * dividers between sections. Not as icons.
 */

/* ── Ornaments ────────────────────────────────────────────────────────── */

export type OrnamentCorner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const CORNER: Record<OrnamentCorner, CSSProperties> = {
  "top-left": { top: "-22%", left: "-10%", rotate: "-8deg" },
  "top-right": { top: "-22%", right: "-10%", rotate: "8deg" },
  "bottom-left": { bottom: "-26%", left: "-10%", rotate: "6deg" },
  "bottom-right": { bottom: "-26%", right: "-8%", rotate: "-6deg" },
};

/**
 * A duotone shape, large and faint, cropped off a corner of its parent. The
 * parent needs `position: relative; overflow: hidden` (or `isolation`) — the
 * ornament sits behind its siblings. `strength` is the opacity: keep it low
 * behind text.
 */
export function Ornament({
  shape,
  corner = "bottom-right",
  size = 360,
  strength = 0.12,
  className,
}: {
  shape: BrandShapeName;
  corner?: OrnamentCorner;
  size?: number;
  strength?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("dash-ornament pointer-events-none absolute -z-10", className)}
      style={{ ...CORNER[corner], width: size, height: size, opacity: strength }}
      aria-hidden
    >
      <BrandShape name={shape} className="size-full" />
    </div>
  );
}

/* ── Covers ───────────────────────────────────────────────────────────── */

export type CoverTone = "navy" | "gold" | "sky";

/**
 * A module or course cover: a toned ground with the art as an ornament — a
 * shape cropped large off the bottom-right corner, or a research glyph drawn
 * big and faint behind a crisp one — and an optional badge (an icon) top-left.
 */
export function Cover({
  art,
  tone = "navy",
  photo,
  badge,
  className,
  children,
}: {
  art: ModuleArt;
  tone?: CoverTone;
  /**
   * Build the cover around a photograph, in full colour under a navy fade.
   * The art becomes the accent: a glyph moves into the badge, a shape stands
   * small in the corner.
   */
  photo?: string;
  badge?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  if (photo) {
    return (
      <div className={cn("dash-art dash-cover dash-cover-with-photo", className)} data-tone="navy">
        <div className="dash-cover-photo" aria-hidden>
          <img src={photo} alt="" loading="lazy" decoding="async" />
        </div>
        {art.kind === "shape" && (
          <div className="dash-cover-photo-shape" aria-hidden>
            <BrandShape name={art.name} className="size-full" />
          </div>
        )}
        <div className="dash-cover-badge">
          {badge ?? (art.kind === "glyph" ? <ResearchGlyph name={art.name} className="size-7" /> : null)}
        </div>
        {children}
      </div>
    );
  }
  return (
    <div className={cn("dash-art dash-cover", className)} data-tone={tone}>
      {art.kind === "shape" ? (
        <div className="dash-cover-shape" aria-hidden>
          <BrandShape name={art.name} className="size-full" />
        </div>
      ) : (
        <>
          <div className="dash-cover-glyph-ghost" aria-hidden>
            <ResearchGlyph name={art.name} className="size-full" />
          </div>
          <div className="dash-cover-glyph" aria-hidden>
            <ResearchGlyph name={art.name} className="size-full" />
          </div>
        </>
      )}
      {badge && <div className="dash-cover-badge">{badge}</div>}
      {children}
    </div>
  );
}

/* ── Photo frames ─────────────────────────────────────────────────────── */

export type PhotoFrameShape = "blob" | "arch" | "pill" | "bracket" | "rounded";

/**
 * A photograph in one of the kit's frames, through the brand duotone. With no
 * `src`, a labelled placeholder holds the place — never a stock stand-in.
 */
export function PhotoFrame({
  frame = "rounded",
  src,
  alt = "",
  placeholder = "Photo to come",
  duotone = true,
  className,
  children,
}: {
  frame?: PhotoFrameShape;
  src?: string;
  alt?: string;
  placeholder?: string;
  duotone?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const crop =
    frame === "blob"
      ? "graphic-mask-blob"
      : frame === "pill"
        ? "graphic-mask-pill"
        : frame === "arch"
          ? "graphic-mask-arch"
          : "rounded-[24px]";
  const inner = (
    <div className={cn("dash-photo relative size-full overflow-hidden", crop)}>
      {src ? (
        duotone ? (
          <Image src={src} alt={alt} treatment="duotone" aspectRatio="fill" variant="default" className="!h-full" />
        ) : (
          <img src={src} alt={alt} className="size-full object-cover" />
        )
      ) : (
        <div className="dash-photo-placeholder grid size-full place-items-center">
          <span className="flex flex-col items-center gap-1.5 text-center text-xs font-semibold">
            <Camera className="size-5" aria-hidden />
            {placeholder}
          </span>
        </div>
      )}
      {children}
    </div>
  );
  if (frame !== "bracket") return <div className={className}>{inner}</div>;
  return (
    <div className={cn("dash-bracket relative p-3", className)}>
      <span className="dash-bracket-corner left-0 top-0 border-l-2 border-t-2" aria-hidden />
      <span className="dash-bracket-corner right-0 top-0 border-r-2 border-t-2" aria-hidden />
      <span className="dash-bracket-corner bottom-0 left-0 border-b-2 border-l-2" aria-hidden />
      <span className="dash-bracket-corner bottom-0 right-0 border-b-2 border-r-2" aria-hidden />
      {inner}
    </div>
  );
}

/* ── Dividers ─────────────────────────────────────────────────────────── */

/** The kit's wave as a section rule: a gold line with its faint echo. */
export function WaveRule({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className={cn("dash-wave-rule block h-14 w-full", className)} aria-hidden>
      <path d="M0 56 C240 6 480 106 720 56 S1200 6 1440 56" fill="none" vectorEffect="non-scaling-stroke" className="dash-wave-echo" />
      <path d="M0 72 C240 22 480 122 720 72 S1200 22 1440 72" fill="none" vectorEffect="non-scaling-stroke" className="dash-wave-edge" />
    </svg>
  );
}

/** The kit's figure band, faded at both ends — a quiet break between sections. */
export function FigureRule({ className }: { className?: string }) {
  return (
    <div className={cn("dash-figure-rule", className)} aria-hidden>
      <FigureBand />
    </div>
  );
}

/**
 * The kit's pathway rule as progress: one node per step, filled when done,
 * the goal gold once everything is.
 */
export function LessonPath({ total, done, className }: { total: number; done: number; className?: string }) {
  return (
    <div
      className={cn("graphic graphic-pathway dash-lesson-path", className)}
      role="img"
      aria-label={`${done} of ${total} lessons done`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={cn("graphic-pathway-node", i >= done && "dash-path-todo")} />
      ))}
      <span className={cn("graphic-pathway-node graphic-pathway-goal", done < total && "dash-path-todo")} />
    </div>
  );
}
