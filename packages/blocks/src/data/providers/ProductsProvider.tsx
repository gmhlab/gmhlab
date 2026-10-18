import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { ProductsContext } from "../contexts/ProductsContext";
import {
  cartTotal,
  filterProducts,
  searchProducts,
  sortProducts,
  type Product,
  type ProductCart,
  type ProductFilter,
  type ProductSort,
  type SearchParams,
} from "@gmhlab/core";
// Hardwired until @gmhlab/data takes the service as a prop.
import { mockProductsService as productsService } from "@gmhlab/core/mocks";

/**
 * Products provider with full state management
 */
export function ProductsProvider({ children }: { children?: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: "",
    filters: {},
    sort: "name",
    page: 1,
    limit: 10,
  });
  const [cart, setCart] = useState<ProductCart>({
    items: [],
    total: 0,
    currency: "$",
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load products on mount
  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      setError(null);

      try {
        const productData = await productsService.getProducts();
        setProducts(productData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  // Load persisted data from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem("product-favorites");
    const storedRecentlyViewed = localStorage.getItem("recently-viewed");
    const storedCart = localStorage.getItem("product-cart");

    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
    if (storedRecentlyViewed) {
      setRecentlyViewed(JSON.parse(storedRecentlyViewed));
    }
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Persist favorites to localStorage
  useEffect(() => {
    localStorage.setItem("product-favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Persist recently viewed to localStorage
  useEffect(() => {
    localStorage.setItem("recently-viewed", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem("product-cart", JSON.stringify(cart));
  }, [cart]);

  // Update cart total when items change
  useEffect(() => {
    const total = cartTotal(cart.items);
    setCart((prev) => ({ ...prev, total }));
  }, [cart.items]);

  // Compute filtered products
  const filteredProducts = useMemo(() => {
    let result = products;

    // Apply search query
    if (searchParams.query) {
      result = searchProducts(result, searchParams.query);
    }

    // Apply filters
    result = filterProducts(result, searchParams.filters);

    // Apply sorting
    result = sortProducts(result, searchParams.sort);

    return result;
  }, [products, searchParams]);

  const search = useCallback((query: string) => {
    setSearchParams((prev) => ({ ...prev, query, page: 1 }));
  }, []);

  const setFilters = useCallback((filters: ProductFilter) => {
    setSearchParams((prev) => ({ ...prev, filters, page: 1 }));
  }, []);

  const setSort = useCallback((sort: ProductSort) => {
    setSearchParams((prev) => ({ ...prev, sort, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setSearchParams((prev) => ({ ...prev, page }));
  }, []);

  const addToCart = useCallback(
    (productId: string, quantity: number = 1) => {
      const product = products.find((p) => p.id === productId);

      if (!product) {
        setError(new Error(`Product with id ${productId} not found`));
        return;
      }

      if (!product.inStock) {
        setError(new Error(`Product ${product.name} is out of stock`));
        return;
      }

      setCart((prev) => {
        const existingItem = prev.items.find(
          (item) => item.product.id === productId,
        );

        if (existingItem) {
          // Update quantity
          return {
            ...prev,
            items: prev.items.map((item) =>
              item.product.id === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            ),
          };
        } else {
          // Add new item
          return {
            ...prev,
            items: [...prev.items, { product, quantity }],
          };
        }
      });
    },
    [products],
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.product.id !== productId),
    }));
  }, []);

  const updateCartQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }

      setCart((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item,
        ),
      }));
    },
    [removeFromCart],
  );

  const clearCart = useCallback(() => {
    setCart({ items: [], total: 0, currency: "$" });
  }, []);

  const addToFavorites = useCallback((productId: string) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) return prev;
      return [...prev, productId];
    });
  }, []);

  const removeFromFavorites = useCallback((productId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== productId));
  }, []);

  const addToRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 10); // Keep only last 10
    });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      products,
      filteredProducts,
      searchParams,
      cart,
      favorites,
      recentlyViewed,
      isLoading,
      error,
      search,
      setFilters,
      setSort,
      setPage,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      addToFavorites,
      removeFromFavorites,
      addToRecentlyViewed,
      clearError,
    }),
    [
      products,
      filteredProducts,
      searchParams,
      cart,
      favorites,
      recentlyViewed,
      isLoading,
      error,
      search,
      setFilters,
      setSort,
      setPage,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      addToFavorites,
      removeFromFavorites,
      addToRecentlyViewed,
      clearError,
    ],
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}