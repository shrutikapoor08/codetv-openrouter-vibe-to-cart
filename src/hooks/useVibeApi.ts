import { useState } from "react";
import type { Product } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api/vibe";

interface UseVibeApiOptions {
  onSuccess?: (products: Product[]) => void;
  onError?: (error: string) => void;
}

export function useVibeApi(options: UseVibeApiOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchVibeProducts = async (vibe: string, roastMode: boolean = false) => {
    setLoading(true);
    setError("");
    setProducts([]);

    try {
      const url = new URL(API_URL);
      url.searchParams.set("query", vibe);
      if (roastMode) {
        url.searchParams.set("mode", "roast");
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error("Failed to fetch vibe recommendations");
      }

      const data = await response.json();
      setProducts(data);
      options.onSuccess?.(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
      options.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, fetchVibeProducts };
}
