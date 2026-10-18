import type {
  Product,
  ProductCart,
  ProductFilter,
  ProductSort,
  SearchParams,
} from "@gmhlab/core";

/**
 * Products context type
 */
export interface ProductsContextType {
  /**
   * All available products
   */
  products: Product[];
  /**
   * Filtered and sorted products
   */
  filteredProducts: Product[];
  /**
   * Current search parameters
   */
  searchParams: SearchParams;
  /**
   * Shopping cart for products
   */
  cart: ProductCart;
  /**
   * User's favorite products
   */
  favorites: string[];
  /**
   * Recently viewed products
   */
  recentlyViewed: string[];
  /**
   * Whether products are loading
   */
  isLoading: boolean;
  /**
   * Any product errors
   */
  error: Error | null;
  /**
   * Search products
   */
  search: (query: string) => void;
  /**
   * Apply filters
   */
  setFilters: (filters: ProductFilter) => void;
  /**
   * Set sort order
   */
  setSort: (sort: ProductSort) => void;
  /**
   * Set page for pagination
   */
  setPage: (page: number) => void;
  /**
   * Add product to cart
   */
  addToCart: (productId: string, quantity?: number) => void;
  /**
   * Remove product from cart
   */
  removeFromCart: (productId: string) => void;
  /**
   * Update cart item quantity
   */
  updateCartQuantity: (productId: string, quantity: number) => void;
  /**
   * Clear the cart
   */
  clearCart: () => void;
  /**
   * Add product to favorites
   */
  addToFavorites: (productId: string) => void;
  /**
   * Remove product from favorites
   */
  removeFromFavorites: (productId: string) => void;
  /**
   * Add product to recently viewed
   */
  addToRecentlyViewed: (productId: string) => void;
  /**
   * Clear any errors
   */
  clearError: () => void;
}
