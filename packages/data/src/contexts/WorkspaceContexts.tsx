import { createContext } from "react";
import type {
  AccountContextType,
  CheckoutContextType,
  FeaturedPublicationsContextType,
  LearningContextType,
  MediaContextType,
  ProfilesContextType,
  RoomsContextType,
} from "../types/workspace";

export const AccountContext = createContext<AccountContextType | null>(null);
export const LearningContext = createContext<LearningContextType | null>(null);
export const MediaContext = createContext<MediaContextType | null>(null);
export const CheckoutContext = createContext<CheckoutContextType | null>(null);
export const ProfilesContext = createContext<ProfilesContextType | null>(null);
export const RoomsContext = createContext<RoomsContextType | null>(null);
export const FeaturedPublicationsContext = createContext<FeaturedPublicationsContextType | null>(null);
