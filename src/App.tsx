import { useState } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";
import { LOADING_MESSAGES, SURPRISE_VIBES, getEasterEggMessage } from "./constants";
import { useConfetti } from "./hooks/useConfetti";
import type { Product } from "./types";
import CartDrawer from "./components/CartDrawer";
import RoastToggle from "./components/RoastToggle";
import VibeForm from "./components/VibeForm";
import VibeHistory from "./components/VibeHistory";
import ProductGrid from "./components/ProductGrid";
import "./App.css";

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

  const { getInstance, fireConfetti } = useConfetti();

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

  const handleVibeHistoryClick = (pastVibe: string) => {
    setVibe(pastVibe);
    setTimeout(() => {
      const form = document.querySelector("form");
      form?.requestSubmit();
    }, 100);
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
      <CartDrawer
        show={showCartDrawer}
        cartCount={cartCount}
        cartItems={cartItems}
        onClose={() => setShowCartDrawer(false)}
      />

      <div className="container">
        {/* Roast Mode Toggle - Top Right */}
        <RoastToggle roastMode={roastMode} onToggle={setRoastMode} />

        <header className="header">
          <h1 className="title">
            <span className="emoji">🛍️</span>
            Vibe to Cart
          </h1>
          <p className="tagline">
            Tell us your vibe. We'll tell you what to buy.
          </p>
        </header>

        {/* Vibe Form */}
        <VibeForm
          vibe={vibe}
          loading={loading}
          easterEggMessage={easterEggMessage}
          onVibeChange={setVibe}
          onSubmit={handleSubmit}
          onSurpriseMe={handleSurpriseMe}
        />

        {/* Vibe History */}
        <VibeHistory
          vibeHistory={vibeHistory}
          loading={loading}
          onSelectVibe={handleVibeHistoryClick}
        />

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

        {/* Product Grid */}
        <ProductGrid
          products={products}
          loading={loading}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}

export default App;
