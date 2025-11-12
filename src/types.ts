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
 * Vibe image option interface
 */
export interface VibeImage {
  id: number;
  url: string;
  prompt: string;
  vibe: string;
}

/**
 * Clothing item from image analysis
 */
export interface ClothingItem {
  type: string;
  color: string;
  style: string;
}

/**
 * Image analysis result
 */
export interface ImageAnalysis {
  items: ClothingItem[];
  summary: string;
  error?: string;
}
