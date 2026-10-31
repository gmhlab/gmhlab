import { Button } from "@gmhlab/ui";
import { ArrowRight, Lock, ShoppingBag, Sparkles, UserPlus } from "lucide-react";
import { motion } from "motion/react";
import { type DashboardLinkComponent, type DashboardModule, unlockHint } from "./dashboard-types";
import { ArtTile, EASE } from "./kit";

const PlainLink: DashboardLinkComponent = ({ href, children, ...props }) => (
  <a href={href} {...props}>
    {children}
  </a>
);

export type LockedModuleProps = {
  module: Pick<DashboardModule, "title" | "tagline" | "art" | "access" | "price" | "includes">;
  /** The storefront (plans). */
  storeHref: string;
  /** Where access is requested (the profile). */
  profileHref?: string;
  /** Buy this module alone — shown when it has a price. */
  onAddToCart?: () => void;
  inCart?: boolean;
  linkComponent?: DashboardLinkComponent;
};

/**
 * What a gated route renders for an account that can't open it: the module's
 * art behind a lock, what it includes, and the way in that fits its rule —
 * buy it, upgrade, or request access.
 */
export function LockedModule({
  module,
  storeHref,
  profileHref = "/dashboard/account",
  onAddToCart,
  inCart = false,
  linkComponent: Link = PlainLink,
}: LockedModuleProps) {
  const rule = module.access;
  return (
    <div className="grid min-h-[70vh] place-items-center">
      <motion.div
        className="dash-panel w-full max-w-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className="relative">
          <ArtTile art={module.art} tone="navy" size={110} className="aspect-[21/9] w-full !rounded-none blur-[1px] saturate-50" />
          <motion.div
            className="absolute inset-0 grid place-items-center"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 260, damping: 18 }}
          >
            <div className="grid size-20 place-items-center rounded-full bg-surface/90 shadow-level4 ring-4 ring-white/40 backdrop-blur">
              <Lock className="size-8 text-primary" aria-hidden />
            </div>
          </motion.div>
        </div>
        <div className="p-8 text-center">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">{unlockHint(module)}</div>
          <h1 className="mt-2 font-serif text-3xl">{module.title}</h1>
          <p className="mx-auto mt-2 max-w-md text-on-surface-variant">{module.tagline}</p>
          {module.includes.length > 0 && (
            <ul className="mt-6 flex flex-wrap justify-center gap-2">
              {module.includes.map((item) => (
                <li key={item} className="rounded-full bg-surface-container-high px-3 py-1 text-sm">
                  {item}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {rule.kind === "plan" && (
              <>
                <Link
                  href={storeHref}
                  className="dash-shine inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-on-primary"
                >
                  <Sparkles className="size-4" aria-hidden /> See plans
                </Link>
                {module.price !== undefined && onAddToCart && (
                  <Button size="lg" variant="outline" disabled={inCart} onClick={onAddToCart}>
                    <ShoppingBag aria-hidden /> {inCart ? "In your cart" : `Buy it alone · $${module.price}`}
                  </Button>
                )}
              </>
            )}
            {(rule.kind === "project" || (rule.kind === "tier" && rule.min === "staff")) && (
              <Link
                href={profileHref}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-on-primary"
              >
                <UserPlus className="size-4" aria-hidden /> Request access
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
