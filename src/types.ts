/**
 * Product interface for vibe-based recommendations
 */
export interface Product {
  emoji: string;
  name: string;
  reason: string;
  image?: string; // Optional product image path
}
