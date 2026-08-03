import { useContext } from "react";
import { ProductsContext } from "../contexts/ProductsContext";
import type { ProductsContextType } from "../types/products";

/**
 * Hook to access products context
 * @throws Error if used outside of ProductsProvider
 */
export function useProducts(): ProductsContextType {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}