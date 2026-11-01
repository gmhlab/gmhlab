import { createContext } from "react";
import type {
  AccountContextType,
  CheckoutContextType,
  LearningContextType,
  MediaContextType,
  ProfilesContextType,
} from "../types/workspace";

export const AccountContext = createContext<AccountContextType | null>(null);
export const LearningContext = createContext<LearningContextType | null>(null);
export const MediaContext = createContext<MediaContextType | null>(null);
export const CheckoutContext = createContext<CheckoutContextType | null>(null);
export const ProfilesContext = createContext<ProfilesContextType | null>(null);
