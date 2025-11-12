import { useState, useEffect } from "react";
import type { Product } from "../types";

export function useCartRoast(cartItems: Product[], roastMode: boolean) {
  const [roast, setRoast] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!roastMode || cartItems.length === 0) {
      setRoast("");
      return;
    }

    const fetchRoast = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3001/api/roast-cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cartItems }),
        });

        const data = await response.json();
        setRoast(data.roast);
      } catch (error) {
        console.error("Failed to fetch roast:", error);
        setRoast(
          "I'd roast your cart, but my sarcasm module is temporarily offline."
        );
      } finally {
        setLoading(false);
      }
    };

    // Debounce the roast request
    const timer = setTimeout(fetchRoast, 500);
    return () => clearTimeout(timer);
  }, [cartItems, roastMode]);

  return { roast, loading };
}
