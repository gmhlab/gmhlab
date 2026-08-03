/**
 * Product types
 */
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
