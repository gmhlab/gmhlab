export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  rating: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  tags?: string[];
};

export type ProductFilter = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  tags?: string[];
};

export type ProductSort = "name" | "price" | "rating" | "newest";

export type ProductCartItem = {
  product: Product;
  quantity: number;
};

export type ProductCart = {
  items: ProductCartItem[];
  total: number;
  currency: string;
};

export type SearchParams = {
  query: string;
  filters: ProductFilter;
  sort: ProductSort;
  page: number;
  limit: number;
};

/**
 * What a catalogue backend must provide. Filtering, sorting and search are
 * the pure helpers below, not service methods, so every backend gets the
 * same behaviour for free.
 */
export interface ProductsService {
  getProducts(): Promise<Product[]>;
}

/** Keep the products matching every set criterion. */
export function filterProducts(
  products: Product[],
  filters: ProductFilter,
): Product[] {
  return products.filter((product) => {
    if (filters.category && product.category !== filters.category)
      return false;
    if (filters.minPrice && product.price < filters.minPrice) return false;
    if (filters.maxPrice && product.price > filters.maxPrice) return false;
    if (filters.minRating && product.rating < filters.minRating) return false;
    if (filters.inStock !== undefined && product.inStock !== filters.inStock)
      return false;
    if (filters.tags && filters.tags.length > 0) {
      const hasTag = filters.tags.some((tag) =>
        product.tags?.some((productTag) =>
          productTag.toLowerCase().includes(tag.toLowerCase()),
        ),
      );
      if (!hasTag) return false;
    }
    return true;
  });
}

/**
 * Sort a copy of the products. `Product` carries no date, so "newest" assumes
 * the service returns oldest first and reverses that order.
 */
export function sortProducts(
  products: Product[],
  sort: ProductSort,
): Product[] {
  const sortedProducts = [...products];

  switch (sort) {
    case "name":
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    case "price":
      return sortedProducts.sort((a, b) => a.price - b.price);
    case "rating":
      return sortedProducts.sort((a, b) => b.rating - a.rating);
    case "newest":
      return sortedProducts.reverse();
    default:
      return sortedProducts;
  }
}

/** Case-insensitive match on name, description, category and tags. */
export function searchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) return products;

  const lowercaseQuery = query.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      product.tags?.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  );
}

/** Sum of price × quantity over the cart's line items. */
export function cartTotal(items: ProductCartItem[]): number {
  return items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
}
