import { createContext } from "react";
import type {
  AccountContextType,
  CheckoutContextType,
  LearningContextType,
  MediaContextType,
} from "../types/workspace";

export const AccountContext = createContext<AccountContextType | null>(null);
export const LearningContext = createContext<LearningContextType | null>(null);
export const MediaContext = createContext<MediaContextType | null>(null);
export const CheckoutContext = createContext<CheckoutContextType | null>(null);
