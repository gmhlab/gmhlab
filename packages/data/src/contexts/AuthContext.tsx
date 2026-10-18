import { createContext } from "react";
import type { AuthContextType } from "../types/auth";

/**
 * Authentication context
 */
export const AuthContext = createContext<AuthContextType | null>(null);