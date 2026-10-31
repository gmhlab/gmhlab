import {
  BRAND_SHAPES,
  BrandShape,
  CareRings,
  ContourGlobe,
  FigureBand,
  RESEARCH_GLYPHS,
  ResearchGlyph,
  cn,
} from "@gmhlab/ui";
import { Check, Code2, Download } from "lucide-react";
import { motion } from "motion/react";
import { type ReactNode, useRef, useState } from "react";
import { Item, PageHero, Panel, SectionTitle, Stagger } from "./kit";

type Ground = "paper" | "navy" | "gold";

const GROUNDS: { id: Ground; label: string }[] = [
  { id: "paper", label: "Paper" },
  { id: "navy", label: "Navy" },
  { id: "gold", label: "Gold" },
];

const PAINT = ["fill", "stroke", "stop-color", "stop-opacity", "opacity", "fill-opacity", "stroke-opacity", "stroke-width"] as const;

/**
 * Serialise an on-screen graphic with its computed colours baked in, so the
 * file looks the same in PowerPoint or Illustrator as it does here — the kit
 * paints with CSS custom properties that a standalone SVG can't resolve.
 */
export function bakeSvg(svg: SVGSVGElement): string {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const source = [svg, ...svg.querySelectorAll("*")];
  const target = [clone, ...clone.querySelectorAll("*")];
  source.forEach((el, i) => {
    const cs = getComputedStyle(el);
    const out = target[i] as SVGElement;
    for (const prop of PAINT) {
      const value = cs.getPropertyValue(prop);
      if (value && value !== "none" && !(prop.endsWith("opacity") && value === "1")) out.setAttribute(prop, value);
      else if (value === "none" && (prop === "fill" || prop === "stroke")) out.setAttribute(prop, "none");
    }
    out.removeAttribute("class");
    out.removeAttribute("style");
  });
  const box = svg.getBoundingClientRect();
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(Math.round(box.width * 4)));
  clone.setAttribute("height", String(Math.round(box.height * 4)));
  clone.removeAttribute("aria-hidden");
  return `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(clone)}`;
}

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "image/svg+xml" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Tile({
  name,
  code,
  ground,
  children,
  wide = false,
}: {
  name: string;
  code: string;
  ground: Ground;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState<"svg" | "code" | null>(null);
  const flash = (kind: "svg" | "code") => {
    setDone(kind);
    setTimeout(() => setDone(null), 1400);
  };
  return (
    <Item className={cn(wide && "sm:col-span-2")}>
      <Panel className="group overflow-hidden p-0">
        <div
          ref={ref}
          className={cn(
            "dash-art grid place-items-center !rounded-none p-6 transition duration-500 group-hover:scale-[1.02]",
            wide ? "aspect-[2/1]" : "aspect-square",
          )}
          data-tone={ground === "paper" ? undefined : ground === "navy" ? "navy" : "gold"}
          style={ground === "paper" ? { background: "var(--gmh-color-surface)" } : undefined}
        >
          {children}
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-outline-variant/60 px-4 py-3">
          <span className="truncate font-mono text-xs">{name}</span>
          <span className="flex gap-1">
            <button
              type="button"
              className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              aria-label={`Copy JSX for ${name}`}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(code);
                  flash("code");
                } catch {}
              }}
            >
              {done === "code" ? <Check className="size-4 text-success" /> : <Code2 className="size-4" />}
            </button>
            <button
              type="button"
              className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              aria-label={`Download ${name} as SVG`}
              onClick={() => {
                const svg = ref.current?.querySelector("svg");
                if (!svg) return;
                download(`gmh-${name}-${ground}.svg`, bakeSvg(svg));
                flash("svg");
              }}
            >
              {done === "svg" ? <Check className="size-4 text-success" /> : <Download className="size-4" />}
            </button>
          </span>
        </div>
      </Panel>
    </Item>
  );
}

export type GraphicsGalleryProps = {
  title?: string;
  description?: string;
};

/**
 * Every graphic in the kit on the ground of your choice, each downloadable
 * as an SVG with that ground's colours baked in, or copyable as JSX.
 */
export function GraphicsGallery({
  title = "Graphics kit",
  description = "Research glyphs, brand shapes and backdrops. Pick a ground, then download any piece as an SVG in exactly those colours, or copy it as code.",
}: GraphicsGalleryProps) {
  const [ground, setGround] = useState<Ground>("paper");
  return (
    <div className="space-y-10">
      <PageHero eyebrow="Create" title={title} description={description} art={{ kind: "shape", name: "rising-rings" }}>
        <div className="mt-6 inline-flex rounded-full bg-white/10 p-1 ring-1 ring-white/20" role="group" aria-label="Ground">
          {GROUNDS.map((g) => (
            <button
              key={g.id}
              type="button"
              aria-pressed={ground === g.id}
              onClick={() => setGround(g.id)}
              className={cn("relative isolate rounded-full px-4 py-1.5 text-sm font-semibold", ground === g.id ? "text-on-tertiary-container" : "")}
            >
              {ground === g.id && (
                <motion.span layoutId="dash-ground-pill" className="absolute inset-0 -z-10 rounded-full bg-brand-band-accent" />
              )}
              {g.label}
            </button>
          ))}
        </div>
      </PageHero>

      <section>
        <SectionTitle title="Research glyphs" description="One per research theme. 48-unit grid, 1.75 stroke, one gold accent." />
        <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
          {RESEARCH_GLYPHS.map((name) => (
            <Tile key={name} name={name} ground={ground} code={`<ResearchGlyph name="${name}" size={48} />`}>
              <ResearchGlyph name={name} size={88} />
            </Tile>
          ))}
        </Stagger>
      </section>

      <section>
        <SectionTitle title="Brand shapes" description="Duotone spot shapes for covers, slides and empty states." />
        <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {BRAND_SHAPES.map((name) => (
            <Tile key={name} name={name} ground={ground} code={`<BrandShape name="${name}" size={96} />`}>
              <BrandShape name={name} size={120} />
            </Tile>
          ))}
        </Stagger>
      </section>

      <section>
        <SectionTitle title="Backdrops and bands" description="Large pieces for heroes and section breaks." />
        <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Tile name="contour-globe" ground={ground} code={`<ContourGlobe centerpiece="mark" />`} wide>
            <div className="w-full max-w-md">
              <ContourGlobe centerpiece="mark" />
            </div>
          </Tile>
          <Tile name="care-rings" ground={ground} code={`<CareRings />`}>
            <div className="w-full max-w-[16rem]">
              <CareRings />
            </div>
          </Tile>
          <Tile name="figure-band" ground={ground} code={`<FigureBand />`}>
            <div className="w-full">
              <FigureBand />
            </div>
          </Tile>
        </Stagger>
      </section>
    </div>
  );
}
