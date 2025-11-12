import { useState, useRef } from "react";
// import ReactCanvasConfetti from "react-canvas-confetti";
import { SURPRISE_VIBES, APP_GRADIENTS } from "./constants";
import { useConfetti } from "./hooks/useConfetti";
import { useVibeApi } from "./hooks/useVibeApi";
import { useVibeImages } from "./hooks/useVibeImages";
import { useCart } from "./hooks/useCart";
import { useVibeSubmit } from "./hooks/useVibeSubmit";
import type { Product, VibeImage } from "./types";
import CartDrawer from "./components/CartDrawer";
import RoastToggle from "./components/RoastToggle";
import VibeForm from "./components/VibeForm";
import VibeHistory from "./components/VibeHistory";
import VibeImageGrid from "./components/VibeImageGrid";
import ProductGrid from "./components/ProductGrid";
import StatusDisplay from "./components/StatusDisplay";
import "./App.css";

function App() {
  const [vibe, setVibe] = useState("");
  const [roastMode, setRoastMode] = useState(false);
  const [selectedVibe, setSelectedVibe] = useState<VibeImage | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { getInstance, fireConfetti } = useConfetti();
  const { vibeImages, loading: imagesLoading, error: imagesError, fetchVibeImages, clearVibeImages } = useVibeImages();
  const { products, loading: productsLoading, error: productsError, fetchVibeProducts } = useVibeApi();
  const {
    cartItems,
    cartCount,
    showCartDrawer,
    addToCart,
    removeFromCart,
    closeDrawer,
  } = useCart({
    onAddToCart: () => fireConfetti(),
  });

  const { loadingMessage, vibeHistory, easterEggMessage, handleSubmit } =
    useVibeSubmit({
      onSubmit: fetchVibeImages, // First step: fetch vibe images
    });

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Clear previous results
    clearVibeImages();
    setSelectedVibe(null);
    await handleSubmit(vibe);
  };

  const handleSelectVibe = async (vibeImage: VibeImage) => {
    setSelectedVibe(vibeImage);
    // Fetch products for the selected vibe
    await fetchVibeProducts(vibeImage.vibe);
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
      {/* <ReactCanvasConfetti
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
      /> */}

      {/* Cart Drawer */}
      <CartDrawer
        show={showCartDrawer}
        cartCount={cartCount}
        cartItems={cartItems}
        onClose={closeDrawer}
        onRemoveItem={removeFromCart}
        roastMode={roastMode}
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
          loading={imagesLoading}
          easterEggMessage={easterEggMessage}
          onVibeChange={setVibe}
          onSubmit={onFormSubmit}
          onSurpriseMe={handleSurpriseMe}
        />

        {/* Vibe History */}
        <VibeHistory
          vibeHistory={vibeHistory}
          loading={imagesLoading}
          onSelectVibe={handleVibeHistoryClick}
        />

        {/* Status Display - Loading & Errors */}
        <StatusDisplay
          loading={imagesLoading || productsLoading}
          loadingMessage={loadingMessage}
          error={imagesError || productsError}
        />

        {/* Vibe Image Selection Grid */}
        <VibeImageGrid
          vibeImages={vibeImages}
          loading={imagesLoading}
          onSelectVibe={handleSelectVibe}
        />

        {/* Product Grid */}
        <ProductGrid
          products={products}
          loading={productsLoading}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}

export default App;
