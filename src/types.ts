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
