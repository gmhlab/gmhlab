import { useContext } from "react";
import {
  AccountContext,
  CheckoutContext,
  LearningContext,
  MediaContext,
} from "../contexts/WorkspaceContexts";
import type {
  AccountContextType,
  CheckoutContextType,
  LearningContextType,
  MediaContextType,
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
