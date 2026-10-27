import { createContext } from "react";
import type { ContactContextType } from "../types/contact";

/**
 * Contact context
 */
export const ContactContext = createContext<ContactContextType | null>(null);
