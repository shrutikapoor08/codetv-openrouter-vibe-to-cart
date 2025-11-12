import { useState } from "react";
import type { Product } from "../types";

interface UseCartOptions {
  onAddToCart?: (product: Product) => void;
  autoHideDelay?: number;
}

export function useCart(options: UseCartOptions = {}) {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [showCartDrawer, setShowCartDrawer] = useState(false);

  const addToCart = (product: Product) => {
    setCartItems((prev) => [product, ...prev]); // Add to beginning instead of end
    setCartCount((prev) => prev + 1);
    setShowCartDrawer(true);

    // Callback for side effects (e.g., confetti)
    options.onAddToCart?.(product);
  };

  const removeFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
    setCartCount((prev) => prev - 1);
  };

  const closeDrawer = () => {
    setShowCartDrawer(false);
  };

  return {
    cartItems,
    cartCount,
    showCartDrawer,
    addToCart,
    removeFromCart,
    closeDrawer,
  };
}
