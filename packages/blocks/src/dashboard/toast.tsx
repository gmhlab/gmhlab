"use client";

import { CheckCircle2, Info } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type Toast = { id: number; title: string; body?: string; tone?: "success" | "info" };

let next = 1;
const listeners = new Set<(t: Toast) => void>();

/** Show a toast from anywhere in the dashboard. */
export function toast(title: string, body?: string, tone: Toast["tone"] = "success") {
  const t = { id: next++, title, body, tone };
  for (const l of listeners) l(t);
}

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);
  useEffect(() => {
    const add = (t: Toast) => {
      setItems((list) => [...list, t]);
      setTimeout(() => setItems((list) => list.filter((x) => x.id !== t.id)), 4200);
    };
    listeners.add(add);
    return () => {
      listeners.delete(add);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[90] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="dash-panel pointer-events-auto flex gap-3 p-4"
          >
            {t.tone === "info" ? (
              <Info className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
            ) : (
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
            )}
            <div>
              <div className="text-sm font-bold">{t.title}</div>
              {t.body && <div className="mt-0.5 text-sm text-on-surface-variant">{t.body}</div>}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
