import { createContext } from "react";
import type { ProductsContextType } from "../types/products";

/**
 * Products context
 */
export const ProductsContext = createContext<ProductsContextType | null>(null);