import { useContext } from "react";
import {
  AccountContext,
  CheckoutContext,
  FeaturedPublicationsContext,
  LearningContext,
  MediaContext,
  ProfilesContext,
  RoomsContext,
} from "../contexts/WorkspaceContexts";
import type {
  AccountContextType,
  CheckoutContextType,
  FeaturedPublicationsContextType,
  LearningContextType,
  MediaContextType,
  ProfilesContextType,
  RoomsContextType,
} from "../types/workspace";

function required<T>(value: T | null, hook: string, provider: string): T {
  if (!value) throw new Error(`${hook} must be used within a ${provider}`);
  return value;
}

/** The signed-in account. @throws outside an AccountProvider */
export function useAccount(): AccountContextType {
  return required(useContext(AccountContext), "useAccount", "AccountProvider");
}

/** Course progress. @throws outside a LearningProvider */
export function useLearning(): LearningContextType {
  return required(useContext(LearningContext), "useLearning", "LearningProvider");
}

/** The photo library. @throws outside a MediaProvider */
export function usePhotos(): MediaContextType {
  return required(useContext(MediaContext), "usePhotos", "MediaProvider");
}

/** Storefront checkout. @throws outside a CheckoutProvider */
export function useCheckout(): CheckoutContextType {
  return required(useContext(CheckoutContext), "useCheckout", "CheckoutProvider");
}

/** The approved public profiles. @throws outside a ProfilesProvider */
export function useProfiles(): ProfilesContextType {
  return required(useContext(ProfilesContext), "useProfiles", "ProfilesProvider");
}

/** Project room message boards. @throws outside a RoomsProvider */
export function useRooms(): RoomsContextType {
  return required(useContext(RoomsContext), "useRooms", "RoomsProvider");
}

/** Featured publications per project. @throws outside a FeaturedPublicationsProvider */
export function useFeaturedPublications(): FeaturedPublicationsContextType {
  return required(
    useContext(FeaturedPublicationsContext),
    "useFeaturedPublications",
    "FeaturedPublicationsProvider",
  );
}
