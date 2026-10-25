import { useContext } from "react";
import { NewsletterContext } from "../contexts/NewsletterContext";
import type { NewsletterContextType } from "../types/newsletter";

/**
 * Hook to access newsletter context
 * @throws Error if used outside of NewsletterProvider
 */
export function useNewsletter(): NewsletterContextType {
  const context = useContext(NewsletterContext);
  if (!context) {
    throw new Error("useNewsletter must be used within a NewsletterProvider");
  }
  return context;
}
