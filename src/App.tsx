import { useState, useRef } from "react";
// import ReactCanvasConfetti from "react-canvas-confetti";
import { SURPRISE_VIBES, APP_GRADIENTS } from "./constants";
import { useConfetti } from "./hooks/useConfetti";
import { useVibeApi } from "./hooks/useVibeApi";
import { useVibeImages } from "./hooks/useVibeImages";
import { useCart } from "./hooks/useCart";
import { useVibeSubmit } from "./hooks/useVibeSubmit";
import type { Product, VibeImage, ImageAnalysis } from "./types";
import CartDrawer from "./components/CartDrawer";
import RoastToggle from "./components/RoastToggle";
import VibeForm from "./components/VibeForm";
import VibeHistory from "./components/VibeHistory";
import VibeImageGrid from "./components/VibeImageGrid";
import ProductGrid from "./components/ProductGrid";
import StatusDisplay from "./components/StatusDisplay";
import ClothingAnalysis from "./components/ClothingAnalysis";
import "./App.css";

function App() {
  const [vibe, setVibe] = useState("");
  const [roastMode, setRoastMode] = useState(false);
  const [skipImages, setSkipImages] = useState(false);
  const [selectedVibe, setSelectedVibe] = useState<VibeImage | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [clothingAnalysis, setClothingAnalysis] =
    useState<ImageAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [productLoadingMessage, setProductLoadingMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const { getInstance, fireConfetti } = useConfetti();
  const {
    vibeImages,
    loading: imagesLoading,
    error: imagesError,
    fetchVibeImages,
    clearVibeImages,
  } = useVibeImages();
  const {
    products,
    loading: productsLoading,
    error: productsError,
    fetchVibeProducts,
    clearProducts,
  } = useVibeApi();
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
    clearProducts();
    setSelectedVibe(null);
    await handleSubmit(vibe, roastMode, skipImages);
  };

  const handleSelectVibe = async (vibeImage: VibeImage) => {
    setSelectedVibe(vibeImage);
    setProductLoadingMessage("Finding your vibe products...");
    // Fetch products for the selected vibe
    await fetchVibeProducts(vibeImage.vibe);
    setProductLoadingMessage("");
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

  const handleImageClick = async (imageUrl: string) => {
    // Set as background
    setBackgroundImage(imageUrl);
    setAnalysisLoading(true);

    // Scroll to bottom to show the section
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }, 100);

    try {
      const API_URL =
        import.meta.env.VITE_API_URL?.replace("/api/vibe", "") ||
        "http://localhost:3001";
      const response = await fetch(`${API_URL}/api/analyze-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const analysis: ImageAnalysis = await response.json();
      setClothingAnalysis(analysis);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setClothingAnalysis({
        items: [],
        summary: "Unable to analyze this image. Please try another one.",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleCloseAnalysis = () => {
    setBackgroundImage(null);
    setClothingAnalysis(null);
    setAnalysisLoading(false);

    // Scroll back to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="app"
      style={{
        background: backgroundImage
          ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage}) center/cover no-repeat fixed`
          : roastMode
          ? APP_GRADIENTS.roast
          : APP_GRADIENTS.normal,
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
        <div className="toggle-controls">
          <RoastToggle roastMode={roastMode} onToggle={setRoastMode} />

          {/* Skip Images Toggle */}
          {/* <div className="roast-toggle-container">
            <label className="roast-toggle">
              <input
                type="checkbox"
                checked={skipImages}
                onChange={(e) => setSkipImages(e.target.checked)}
              />
              <span className="roast-toggle-label">
                ⚡ Fast Mode (No Images)
              </span>
            </label>
          </div> */}
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

        {/* Vibe Image Selection Grid */}
        <VibeImageGrid
          vibeImages={vibeImages}
          loading={imagesLoading}
          onSelectVibe={handleSelectVibe}
        />

        {/* Status Display - Loading & Errors */}
        <StatusDisplay
          loading={imagesLoading || productsLoading}
          loadingMessage={loadingMessage || productLoadingMessage}
          error={imagesError || productsError}
        />

        {/* Product Grid */}
        <ProductGrid
          products={products}
          loading={productsLoading}
          onAddToCart={handleAddToCart}
          onImageClick={handleImageClick}
        />

        {/* Clothing Analysis Section - Bottom */}
        <ClothingAnalysis
          analysis={clothingAnalysis}
          loading={analysisLoading}
          onClose={handleCloseAnalysis}
        />
      </div>
    </div>
  );
}

export default App;
