import type { ReactNode } from "react";
import type { AuthService, PricingService, ProductsService } from "@gmhlab/core";
import { AuthProvider } from "./AuthProvider";
import { PricingProvider } from "./PricingProvider";
import { ProductsProvider } from "./ProductsProvider";

/**
 * The backends behind each provider. There are no defaults: the demo services
 * live in `@gmhlab/core/mocks`, and a consumer opts into them by passing them.
 */
export type DataServices = {
  auth: AuthService;
  pricing: PricingService;
  products: ProductsService;
};

export type AllProvidersProps = {
  /** Pass a stable object (a module-level constant) — see each provider. */
  services: DataServices;
  children?: ReactNode;
};

/**
 * Combined provider that wraps all MFY providers in the correct order.
 * Use this at the root of your application to enable all MFY features.
 * Renders no DOM of its own.
 *
 * @example
 * ```tsx
 * import {
 *   mockAuthService,
 *   mockPricingService,
 *   mockProductsService,
 * } from "@gmhlab/core/mocks";
 *
 * const services = {
 *   auth: mockAuthService,
 *   pricing: mockPricingService,
 *   products: mockProductsService,
 * };
 *
 * function App() {
 *   return (
 *     <AllProviders services={services}>
 *       <YourApp />
 *     </AllProviders>
 *   );
 * }
 * ```
 */
export function AllProviders({ services, children }: AllProvidersProps) {
  return (
    <AuthProvider service={services.auth}>
      <PricingProvider service={services.pricing}>
        <ProductsProvider service={services.products}>{children}</ProductsProvider>
      </PricingProvider>
    </AuthProvider>
  );
}

/**
 * Alternative provider composition for apps that only need specific features
 *
 * @example
 * ```tsx
 * // E-commerce app with auth and products
 * function EcommerceApp() {
 *   return (
 *     <AuthProvider service={authService}>
 *       <ProductsProvider service={productsService}>
 *         <ShoppingApp />
 *       </ProductsProvider>
 *     </AuthProvider>
 *   );
 * }
 *
 * // SaaS app with auth and pricing
 * function SaaSApp() {
 *   return (
 *     <AuthProvider service={authService}>
 *       <PricingProvider service={pricingService}>
 *         <SubscriptionApp />
 *       </PricingProvider>
 *     </AuthProvider>
 *   );
 * }
 * ```
 */
