import { useContext } from "react";
import { ContactContext } from "../contexts/ContactContext";
import type { ContactContextType } from "../types/contact";

/**
 * Hook to access contact context
 * @throws Error if used outside of ContactProvider
 */
export function useContact(): ContactContextType {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error("useContact must be used within a ContactProvider");
  }
  return context;
}
