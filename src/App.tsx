import { useState, useCallback, useRef } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";
import type { CreateTypes } from "canvas-confetti";
import { LOADING_MESSAGES, SURPRISE_VIBES, getEasterEggMessage } from "./constants";
import "./App.css";

interface Product {
  emoji: string;
  name: string;
  reason: string;
}

function App() {
  const [vibe, setVibe] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [roastMode, setRoastMode] = useState(false);
  const [vibeHistory, setVibeHistory] = useState<string[]>([]);
  const [easterEggMessage, setEasterEggMessage] = useState("");
  
  const refAnimationInstance = useRef<CreateTypes | null>(null);

  const getInstance = useCallback((instance: { confetti: CreateTypes }) => {
    refAnimationInstance.current = instance.confetti;
  }, []);

  const makeShot = useCallback((particleRatio: number, opts: object) => {
    refAnimationInstance.current?.({
      ...opts,
      origin: { y: 0.7 },
      particleCount: Math.floor(200 * particleRatio),
    });
  }, []);

  const fireConfetti = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [makeShot]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vibe.trim()) return;

    // Check for easter eggs
    const easterEgg = getEasterEggMessage(vibe);
    setEasterEggMessage(easterEgg);

    // Add to vibe history
    if (!vibeHistory.includes(vibe)) {
      setVibeHistory((prev) => [vibe, ...prev].slice(0, 5));
    }

    setLoading(true);
    setError("");
    setProducts([]);

    // Rotate loading messages
    const messageInterval = setInterval(() => {
      setLoadingMessage(
        LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]
      );
    }, 1500);

    try {
      const url = new URL("http://localhost:3001/api/vibe");
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      clearInterval(messageInterval);
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleSurpriseMe = () => {
    const randomVibe =
      SURPRISE_VIBES[Math.floor(Math.random() * SURPRISE_VIBES.length)];
    setVibe(randomVibe);
    // Trigger form submission after a brief delay to show the vibe
    setTimeout(() => {
      const form = document.querySelector("form");
      form?.requestSubmit();
    }, 100);
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => [...prev, product]);
    setCartCount((prev) => prev + 1);
    setShowCartDrawer(true);
    
    // Fire confetti!
    fireConfetti();
    
    // Auto-hide drawer after 3 seconds
    setTimeout(() => {
      setShowCartDrawer(false);
    }, 3000);
  };

  return (
    <div className="app">
      {/* Confetti Canvas */}
      <ReactCanvasConfetti
        onInit={getInstance}
        style={{
          position: "fixed",
          pointerEvents: "none",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: 9999,
        }}
      />

      {/* Cart Drawer */}
      {showCartDrawer && (
        <div className="cart-drawer">
          <div className="cart-header">
            <h3>🛒 Vibe Cart ({cartCount})</h3>
            <button
              className="cart-close"
              onClick={() => setShowCartDrawer(false)}
            >
              ✕
            </button>
          </div>
          <div className="cart-items">
            {cartItems.slice(-3).map((item, index) => (
              <div key={index} className="cart-item">
                <span className="cart-item-emoji">{item.emoji}</span>
                <span className="cart-item-name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="container">
        {/* Roast Mode Toggle - Top Right */}
        <div className="roast-toggle-container">
          <label className="roast-toggle">
            <input
              type="checkbox"
              checked={roastMode}
              onChange={(e) => setRoastMode(e.target.checked)}
            />
            <span className="roast-toggle-label">
              {roastMode ? "🔥 Roast Mode" : "💝 Nice Mode"}
            </span>
          </label>
        </div>

        <header className="header">
          <h1 className="title">
            <span className="emoji">🛍️</span>
            Vibe to Cart
          </h1>
          <p className="tagline">
            Tell us your vibe. We'll tell you what to buy.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="vibe-form">
          <div className="vibe-input-container">
            <input
              type="text"
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              placeholder="Tell us your vibe... (e.g., villain era, hot mess express)"
              className="vibe-input"
              disabled={loading}
            />
            {/* Easter Egg Message - Inline below input */}
            {easterEggMessage && (
              <div className="easter-egg">{easterEggMessage}</div>
            )}
          </div>
          <button
            type="submit"
            className="vibe-button"
            disabled={loading || !vibe.trim()}
          >
            {loading ? "Vibing..." : "Get My Vibe"}
          </button>
          <button
            type="button"
            className="surprise-button"
            onClick={handleSurpriseMe}
            disabled={loading}
          >
            🎲 Surprise Me
          </button>
        </form>

        {/* Vibe History */}
        {vibeHistory.length > 0 && (
          <div className="vibe-history">
            <span className="vibe-history-title">Recent Vibes:</span>
            <div className="vibe-history-items">
              {vibeHistory.map((pastVibe, index) => (
                <button
                  key={index}
                  className="vibe-history-item"
                  onClick={() => {
                    setVibe(pastVibe);
                    setTimeout(() => {
                      const form = document.querySelector("form");
                      form?.requestSubmit();
                    }, 100);
                  }}
                  disabled={loading}
                >
                  {pastVibe}
                </button>
              ))}
            </div>
          </div>
        )}

        {loadingMessage && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p className="loading-text">{loadingMessage}</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>❌ {error}</p>
          </div>
        )}

        {products.length > 0 && !loading && (
          <div className="products">
            <h2 className="products-title">Your Vibe Products</h2>
            <div className="product-grid">
              {products.map((product, index) => (
                <div key={index} className="product-card">
                  <div className="product-emoji">{product.emoji}</div>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-reason">{product.reason}</p>
                  <button
                    className="add-to-cart"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Vibe Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
