import { useState, useCallback } from "react";
import { LOADING_MESSAGES, getEasterEggMessage } from "../constants";

interface UseVibeSubmitOptions {
  onSubmit: (vibe: string, roastMode: boolean, skipImages?: boolean) => Promise<void>;
}

/**
 * Custom hook to manage vibe form submission, loading messages, and history
 */
export function useVibeSubmit({ onSubmit }: UseVibeSubmitOptions) {
  const [loadingMessage, setLoadingMessage] = useState("");
  const [vibeHistory, setVibeHistory] = useState<string[]>([]);
  const [easterEggMessage, setEasterEggMessage] = useState("");

  const handleSubmit = useCallback(
    async (vibe: string, roastMode: boolean, skipImages?: boolean) => {
      if (!vibe.trim()) return;

      // Check for easter eggs
      const easterEgg = getEasterEggMessage(vibe);
      setEasterEggMessage(easterEgg);

      // Add to vibe history
      if (!vibeHistory.includes(vibe)) {
        setVibeHistory((prev) => [vibe, ...prev].slice(0, 5));
      }

      // Rotate loading messages
      const messageInterval = setInterval(() => {
        setLoadingMessage(
          LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]
        );
      }, 1500);

      try {
        await onSubmit(vibe, roastMode, skipImages);
      } finally {
        clearInterval(messageInterval);
        setLoadingMessage("");
      }
    },
    [onSubmit, vibeHistory]
  );

  return {
    loadingMessage,
    vibeHistory,
    easterEggMessage,
    handleSubmit,
  };
}
