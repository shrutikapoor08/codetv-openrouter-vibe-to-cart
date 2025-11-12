/**
 * Product interface for vibe-based recommendations
 */
export interface Product {
  emoji: string;
  name: string;
  reason: string;
  image?: string; // Optional product image path
}

/**
 * Clothing item from image analysis
 */
export interface ClothingItem {
  type: string;
  color: string;
  style: string;
  imageUrl?: string;
  shoppingLinks?: {
    title: string;
    url: string;
    snippet: string;
  }[];
}

/**
 * Image analysis result
 */
export interface ImageAnalysis {
  items: ClothingItem[];
  summary: string;
  error?: string;
}
