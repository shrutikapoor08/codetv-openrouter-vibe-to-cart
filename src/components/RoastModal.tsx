import { useEffect, useState } from "react";
import type { Product } from "../types";
import "../styles/RoastModal.css";

interface RoastModalProps {
  show: boolean;
  cartItems: Product[];
  onClose: () => void;
}

export default function RoastModal({
  show,
  cartItems,
  onClose,
}: RoastModalProps) {
  const [roast, setRoast] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (!show || cartItems.length === 0) {
      return;
    }

    const fetchRoast = async () => {
      setLoading(true);
      try {
        // Strip out base64 images to avoid 413 payload too large errors
        const itemsWithoutImages = cartItems.map(({ emoji, name, reason }) => ({
          emoji,
          name,
          reason,
        }));

        const response = await fetch("http://localhost:3001/api/roast-cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cartItems: itemsWithoutImages }),
        });

        const data = await response.json();
        setRoast(data.roast);

        // Trigger shake animation when roast loads
        setTimeout(() => setShake(true), 100);
        setTimeout(() => setShake(false), 600);
      } catch (error) {
        console.error("Failed to fetch roast:", error);
        setRoast(
          "I'd roast your cart, but my sarcasm module is temporarily offline."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoast();
  }, [show, cartItems]);

  if (!show) return null;

  return (
    <div className="roast-modal-overlay" onClick={onClose}>
      <div
        className={`roast-modal-content ${shake ? "roast-modal-shake" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="roast-modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="roast-modal-header">
          <div className="roast-modal-flames">🔥🔥🔥</div>
          <h2 className="roast-modal-title">YOU'VE BEEN ROASTED</h2>
          <div className="roast-modal-flames">🔥🔥🔥</div>
        </div>

        {loading ? (
          <div className="roast-modal-loading">
            <div className="roast-modal-spinner"></div>
            <p>Preparing your roast...</p>
          </div>
        ) : (
          <div className="roast-modal-roast">
            <p className="roast-modal-text">{roast}</p>
          </div>
        )}

        <div className="roast-modal-footer">
          <p className="roast-modal-warning">⚠️ EMOTIONAL DAMAGE INCOMING ⚠️</p>
        </div>
      </div>
    </div>
  );
}
