import { useState, useRef } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";
import { SURPRISE_VIBES, APP_GRADIENTS } from "./constants";
import { useConfetti } from "./hooks/useConfetti";
import { useVibeApi } from "./hooks/useVibeApi";
import { useCart } from "./hooks/useCart";
import { useVibeSubmit } from "./hooks/useVibeSubmit";
import type { Product } from "./types";
import CartDrawer from "./components/CartDrawer";
import RoastToggle from "./components/RoastToggle";
import VibeForm from "./components/VibeForm";
import VibeHistory from "./components/VibeHistory";
import ProductGrid from "./components/ProductGrid";
import StatusDisplay from "./components/StatusDisplay";
import "./App.css";

function App() {
  const [vibe, setVibe] = useState("");
  const [roastMode, setRoastMode] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const { getInstance, fireConfetti } = useConfetti();
  const { products, loading, error, fetchVibeProducts } = useVibeApi();
  const { cartItems, cartCount, showCartDrawer, addToCart, closeDrawer } =
    useCart({
      onAddToCart: () => fireConfetti(),
    });

  const { loadingMessage, vibeHistory, easterEggMessage, handleSubmit } =
    useVibeSubmit({
      onSubmit: fetchVibeProducts,
    });

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(vibe, roastMode);
  };

  const handleSurpriseMe = () => {
    const randomVibe =
      SURPRISE_VIBES[Math.floor(Math.random() * SURPRISE_VIBES.length)];
    setVibe(randomVibe);
    // Trigger form submission using ref
    setTimeout(() => {
      formRef.current?.requestSubmit();
    }, 100);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleVibeHistoryClick = (pastVibe: string) => {
    setVibe(pastVibe);
    setTimeout(() => {
      formRef.current?.requestSubmit();
    }, 100);
  };

  return (
    <div
      className="app"
      style={{
        background: roastMode ? APP_GRADIENTS.roast : APP_GRADIENTS.normal,
        transition: "background 0.5s ease-out",
      }}
    >
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
        onClose={closeDrawer}
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
          ref={formRef}
          vibe={vibe}
          loading={loading}
          easterEggMessage={easterEggMessage}
          onVibeChange={setVibe}
          onSubmit={onFormSubmit}
          onSurpriseMe={handleSurpriseMe}
        />

        {/* Vibe History */}
        <VibeHistory
          vibeHistory={vibeHistory}
          loading={loading}
          onSelectVibe={handleVibeHistoryClick}
        />

        {/* Status Display - Loading & Errors */}
        <StatusDisplay
          loading={loading}
          loadingMessage={loadingMessage}
          error={error}
        />

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
