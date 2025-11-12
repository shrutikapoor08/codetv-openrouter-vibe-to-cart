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
    setCartItems((prev) => [...prev, product]);
    setCartCount((prev) => prev + 1);
    setShowCartDrawer(true);

    // Callback for side effects (e.g., confetti)
    options.onAddToCart?.(product);

    // Auto-hide drawer after delay
    const delay = options.autoHideDelay ?? 3000;
    setTimeout(() => {
      setShowCartDrawer(false);
    }, delay);
  };

  const closeDrawer = () => {
    setShowCartDrawer(false);
  };

  return {
    cartItems,
    cartCount,
    showCartDrawer,
    addToCart,
    closeDrawer,
  };
}
