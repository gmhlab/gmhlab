import { Button, cn } from "@gmhlab/ui";
import { Check, ClipboardCopy, Code2 } from "lucide-react";
import { useMemo, useState } from "react";
import { GMH_DASHBOARD_COPY } from "../shared/gmh-copy";
import { toHex, useTokenColors } from "./brand-studio";
import { PageHero, Panel, SectionTitle } from "./kit";

export type SignatureDetails = {
  name: string;
  pronouns: string;
  title: string;
  unit: string;
  email: string;
  phone: string;
};

/** `hex` at `weight` over white — a navy-derived grey for small print. */
function tintOverWhite(hex: string, weight: number) {
  const n = Number.parseInt(hex.slice(1), 16);
  const ch = (shift: number) => Math.round(((n >> shift) & 255) * weight + 255 * (1 - weight));
  return `#${[16, 8, 0].map((sh) => ch(sh).toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * The signature as email-safe HTML: one table, inline styles, web-safe font
 * stacks, colours as literal hex (read from the tokens, since mail clients
 * can't resolve CSS variables).
 */
export function signatureHtml(d: SignatureDetails, colors: { navy: string; gold: string }, lines: string[]) {
  const muted = tintOverWhite(colors.navy, 0.72);
  const sans = "'Avenir Next', Avenir, 'Segoe UI', Arial, sans-serif";
  const serif = "Baskerville, 'Libre Baskerville', Georgia, serif";
  const contact = [d.email && `<a href="mailto:${esc(d.email)}" style="color:${colors.navy};text-decoration:none">${esc(d.email)}</a>`, d.phone && esc(d.phone)]
    .filter(Boolean)
    .join(" &nbsp;·&nbsp; ");
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${sans};color:${colors.navy};font-size:13px;line-height:1.45">
<tr><td style="border-left:3px solid ${colors.gold};padding:2px 0 2px 14px">
<div style="font-family:${serif};font-size:18px;color:${colors.navy}">${esc(d.name || "Your name")}${d.pronouns ? ` <span style="font-family:${sans};font-size:12px;color:${muted}">(${esc(d.pronouns)})</span>` : ""}</div>
${d.title ? `<div style="font-weight:600">${esc(d.title)}</div>` : ""}
${d.unit ? `<div>${esc(d.unit)}</div>` : ""}
<div style="margin-top:8px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;font-weight:700">${esc(lines[0] ?? "")}</div>
${lines.slice(1).map((l) => `<div style="font-size:12px;color:${muted}">${esc(l)}</div>`).join("")}
${contact ? `<div style="margin-top:8px;font-size:12px">${contact}</div>` : ""}
</td></tr></table>`;
}

export type EmailSignatureBuilderProps = {
  defaults: Partial<SignatureDetails>;
  /** The organisation lines under the person. Defaults to the Center's. */
  lines?: string[];
  title?: string;
  description?: string;
};

/** Fill in the form, copy a signature that pastes into Outlook and Gmail. */
export function EmailSignatureBuilder({
  defaults,
  lines = [GMH_DASHBOARD_COPY.organisation, GMH_DASHBOARD_COPY.school, GMH_DASHBOARD_COPY.institution],
  title = "Email signature",
  description = "One consistent sign-off for everyone. Fill in your details, copy, and paste into your mail settings.",
}: EmailSignatureBuilderProps) {
  const [d, setD] = useState<SignatureDetails>({
    name: "",
    pronouns: "",
    title: "",
    unit: "",
    email: "",
    phone: "",
    ...defaults,
  });
  const [copied, setCopied] = useState<"rich" | "html" | null>(null);
  const [dark, setDark] = useState(false);
  const tokens = useTokenColors(["--gmh-color-navy", "--gmh-color-tertiary-container"]);
  const colors = useMemo(
    () => ({
      navy: tokens["--gmh-color-navy"] ? toHex(tokens["--gmh-color-navy"]!) : "",
      gold: tokens["--gmh-color-tertiary-container"] ? toHex(tokens["--gmh-color-tertiary-container"]!) : "",
    }),
    [tokens],
  );
  const html = colors.navy ? signatureHtml(d, colors, lines) : "";

  const flash = (kind: "rich" | "html") => {
    setCopied(kind);
    setTimeout(() => setCopied(null), 1600);
  };

  const copyRich = async () => {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([[d.name, d.title, d.unit, ...lines, d.email, d.phone].filter(Boolean).join("\n")], { type: "text/plain" }),
        }),
      ]);
      flash("rich");
    } catch {
      // Older browsers: fall back to the HTML source.
      await navigator.clipboard.writeText(html).catch(() => {});
      flash("html");
    }
  };

  const field = (key: keyof SignatureDetails, label: string, hint?: string) => (
    <label className="block">
      <span className="mb-1.5 flex justify-between text-sm font-semibold">
        {label}
        {hint && <span className="font-normal text-on-surface-variant">{hint}</span>}
      </span>
      <input
        value={d[key]}
        onChange={(e) => setD((v) => ({ ...v, [key]: e.target.value }))}
        className="h-11 w-full rounded-2xl border border-outline-variant bg-surface-container-lowest px-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
      />
    </label>
  );

  return (
    <div className="space-y-10">
      <PageHero eyebrow="Create" title={title} description={description} art={{ kind: "shape", name: "pill" }} />
      <div className="grid gap-6 xl:grid-cols-[24rem_minmax(0,1fr)]">
        <Panel className="space-y-4 p-6">
          {field("name", "Name")}
          {field("pronouns", "Pronouns", "optional")}
          {field("title", "Role")}
          {field("unit", "Project or team", "optional")}
          {field("email", "Email")}
          {field("phone", "Phone", "optional")}
        </Panel>
        <div className="space-y-4">
          <SectionTitle
            title="Preview"
            action={
              <div className="flex rounded-full bg-surface-container-high p-1 text-sm font-semibold">
                {[false, true].map((v) => (
                  <button
                    key={String(v)}
                    type="button"
                    aria-pressed={dark === v}
                    onClick={() => setDark(v)}
                    className={cn("rounded-full px-3 py-1", dark === v ? "bg-primary text-on-primary" : "text-on-surface-variant")}
                  >
                    {v ? "Dark inbox" : "Light inbox"}
                  </button>
                ))}
              </div>
            }
          />
          <div className={cn("rounded-[28px] p-8 shadow-level2 ring-1 ring-outline-variant transition-colors", dark ? "bg-neutral-900" : "bg-white")}>
            <div className={cn("mb-6 space-y-2 text-sm", dark ? "text-neutral-400" : "text-neutral-500")}>
              <p>Hi all,</p>
              <p>Slides from today are attached.</p>
              <p>Best,</p>
            </div>
            {/* Mail clients invert dark-mode signatures; this shows roughly what readers see. */}
            <div className={cn(dark && "rounded-xl bg-white/95 p-3")} dangerouslySetInnerHTML={{ __html: html }} />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="dash-shine" onClick={copyRich} disabled={!html}>
              {copied === "rich" ? <Check aria-hidden /> : <ClipboardCopy aria-hidden />}
              {copied === "rich" ? "Copied — paste it into your mail settings" : "Copy signature"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={async () => {
                await navigator.clipboard.writeText(html).catch(() => {});
                flash("html");
              }}
            >
              {copied === "html" ? <Check aria-hidden /> : <Code2 aria-hidden />} Copy HTML
            </Button>
          </div>
          <Panel className="p-5 text-sm text-on-surface-variant">
            <strong className="text-on-surface">Outlook:</strong> Settings → Mail → Compose and reply → Email signature, then paste.{" "}
            <strong className="text-on-surface">Gmail:</strong> Settings → See all settings → General → Signature, then paste.
          </Panel>
        </div>
      </div>
    </div>
  );
}
