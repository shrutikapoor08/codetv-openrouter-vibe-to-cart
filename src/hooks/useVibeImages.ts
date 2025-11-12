import { useState } from "react";
import type { VibeImage } from "../types";

const API_URL = "http://localhost:3001/api/vibe-images";

export function useVibeImages() {
  const [vibeImages, setVibeImages] = useState<VibeImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchVibeImages = async (vibe: string) => {
    setLoading(true);
    setError("");
    setVibeImages([]);

    try {
      const url = new URL(API_URL);
      url.searchParams.set("query", vibe);

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error("Failed to fetch vibe images");
      }

      const data = await response.json();
      setVibeImages(data.images || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearVibeImages = () => {
    setVibeImages([]);
  };

  return { vibeImages, loading, error, fetchVibeImages, clearVibeImages };
}
