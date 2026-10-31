import { Button, cn } from "@gmhlab/ui";
import { ShoppingBag, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { GMH_DASHBOARD_COPY } from "../shared/gmh-copy";
import type { DashboardModule } from "./dashboard-types";
import { ArtTile, Confetti, toneAt } from "./kit";

export type CartLine = { id: string; name: string; price: number; quantity: number };

export type DashboardCartProps = {
  open: boolean;
  onClose: () => void;
  lines: CartLine[];
  /** For each line's art; lines without a module still render. */
  modules?: DashboardModule[];
  currency?: string;
  onRemove: (id: string) => void;
  /** Resolves when the order is placed; rejects with a message to show. */
  onCheckout: () => Promise<void>;
  note?: string | null;
};

/** The storefront cart: a sheet from the right with a celebratory checkout. */
export function DashboardCart({
  open,
  onClose,
  lines,
  modules = [],
  currency = "$",
  onRemove,
  onCheckout,
  note = GMH_DASHBOARD_COPY.storeNote,
}: DashboardCartProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [party, setParty] = useState(false);
  const total = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);

  const checkout = async () => {
    setBusy(true);
    setError(null);
    try {
      await onCheckout();
      setParty(true);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout didn't go through.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {party && <Confetti onDone={() => setParty(false)} />}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[70] bg-scrim/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Cart"
              className="fixed inset-y-0 right-0 z-[71] flex w-[min(28rem,100vw)] flex-col bg-surface-container-low shadow-level5"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
            >
              <div className="flex items-center justify-between border-b border-outline-variant px-6 py-5">
                <h2 className="font-serif text-xl">Your cart</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-2 hover:bg-surface-container-high"
                  aria-label="Close cart"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                {lines.length === 0 ? (
                  <div className="grid h-full place-items-center text-center">
                    <div>
                      <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-surface-container-high">
                        <ShoppingBag className="size-7 text-on-surface-variant" aria-hidden />
                      </div>
                      <p className="font-semibold">Nothing here yet</p>
                      <p className="mt-1 text-sm text-on-surface-variant">Add-ons from the store land here.</p>
                    </div>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    <AnimatePresence initial={false}>
                      {lines.map((line, i) => {
                        const module = modules.find((m) => m.id === line.id);
                        return (
                          <motion.li
                            key={line.id}
                            layout
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 40, height: 0 }}
                            className="flex items-center gap-4 rounded-2xl bg-surface-container-lowest p-3"
                          >
                            {module ? (
                              <ArtTile art={module.art} tone={toneAt(i)} size={34} className="size-14 shrink-0" />
                            ) : (
                              <div className="size-14 shrink-0 rounded-2xl bg-surface-container-high" />
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-semibold">{line.name}</div>
                              <div className="text-sm text-on-surface-variant">
                                {currency}
                                {line.price}
                                {line.quantity > 1 && ` × ${line.quantity}`}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => onRemove(line.id)}
                              className="rounded-full p-2 text-on-surface-variant hover:bg-error-container hover:text-on-error-container"
                              aria-label={`Remove ${line.name}`}
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </ul>
                )}
              </div>

              <div className="border-t border-outline-variant px-6 py-5">
                <div className="mb-4 flex items-baseline justify-between">
                  <span className="text-on-surface-variant">Total</span>
                  <span className="font-serif text-2xl tabular-nums">
                    {currency}
                    {total.toFixed(2)}
                  </span>
                </div>
                {error && <p className="mb-3 text-sm text-error">{error}</p>}
                <Button
                  className={cn("w-full", lines.length > 0 && !busy && "dash-shine")}
                  size="lg"
                  disabled={lines.length === 0 || busy}
                  onClick={checkout}
                >
                  {busy ? "Placing order…" : "Check out"}
                </Button>
                {note && <p className="mt-3 text-center text-xs text-on-surface-variant">{note}</p>}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
