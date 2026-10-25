import { createContext } from "react";
import type { NewsletterContextType } from "../types/newsletter";

/**
 * Newsletter context
 */
export const NewsletterContext = createContext<NewsletterContextType | null>(null);
