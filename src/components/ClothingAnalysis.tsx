import type { ImageAnalysis, ClothingItem, Product } from "../types";

interface ClothingAnalysisProps {
  analysis: ImageAnalysis | null;
  loading: boolean;
  imageUrl: string | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ClothingAnalysis({
  analysis,
  loading,
  imageUrl,
  onClose,
  onAddToCart,
}: ClothingAnalysisProps) {
  if (!analysis && !loading) return null;

  // Convert ClothingItem to Product format for cart
  const convertToProduct = (item: ClothingItem): Product => ({
    emoji: getEmojiForItem(item.type),
    name: `${item.color} ${item.type}`,
    reason: `${item.style}`,
    image: item.imageUrl,
  });

  // Get appropriate emoji for item type
  const getEmojiForItem = (type: string): string => {
    const typeMap: Record<string, string> = {
      dress: "👗",
      top: "👚",
      shirt: "👔",
      blouse: "👚",
      sweater: "🧥",
      jacket: "🧥",
      coat: "🧥",
      pants: "👖",
      jeans: "👖",
      shorts: "🩳",
      skirt: "👗",
      shoes: "👞",
      boots: "👢",
      sneakers: "👟",
      heels: "👠",
      sandals: "👡",
      bag: "👜",
      purse: "👛",
      handbag: "👜",
      clutch: "👝",
      backpack: "🎒",
      hat: "🎩",
      cap: "🧢",
      scarf: "🧣",
      gloves: "🧤",
      belt: "👔",
      sunglasses: "🕶️",
      glasses: "👓",
      necklace: "📿",
      bracelet: "📿",
      earrings: "💍",
      ring: "💍",
      watch: "⌚",
    };

    const lowerType = type.toLowerCase();
    for (const [key, emoji] of Object.entries(typeMap)) {
      if (lowerType.includes(key)) {
        return emoji;
      }
    }
    return "👕"; // Default emoji
  };

  return (
    <div className="clothing-analysis-section">
      <div className="clothing-analysis-header">
        <div>
          <h2>👔 Outfit Details</h2>
          <p className="analysis-subtitle">🍌 Analyzed by Nano Banana AI</p>
        </div>
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
      </div>

      {loading && (
        <div className="clothing-analysis-loading">
          <div className="loading-spinner"></div>
          <p>Analyzing outfit...</p>
        </div>
      )}

      {analysis && !loading && (
        <div className="clothing-analysis-content">
          {imageUrl && (
            <div className="analyzed-image-container">
              <img
                src={imageUrl}
                alt="Analyzed outfit"
                className="analyzed-image"
              />
            </div>
          )}

          <div className="clothing-items">
            <h3>
              🎨 Outfit Breakdown (
              {analysis.items.filter((item) => item.imageUrl).length} items)
            </h3>

            <div className="clothing-items-grid">
              {analysis.items
                .filter((item) => item.imageUrl)
                .map((item, index) => (
                  <div key={index} className="clothing-item-card">
                    <div className="item-image-container">
                      <img
                        src={item.imageUrl}
                        alt={`${item.color} ${item.style} ${item.type}`}
                        className="item-image"
                      />
                    </div>
                    <div className="item-header">
                      <span className="item-number">#{index + 1}</span>
                      <span className="item-type">{item.type}</span>
                    </div>

                    {/* Shopping options */}
                    {item.shoppingLinks && item.shoppingLinks.length > 0 && (
                      <div className="item-shopping">
                        <div className="shopping-title">🛍️ Where to Buy</div>
                        <div className="shopping-options">
                          {item.shoppingLinks.slice(0, 3).map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shopping-option"
                            >
                              <div className="store-info">
                                <img
                                  src={`https://www.google.com/s2/favicons?domain=${
                                    new URL(link.url).hostname
                                  }&sz=32`}
                                  alt={link.store || "Store"}
                                  className="store-logo"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                                <span className="store-name">
                                  {link.store || "Shop"}
                                </span>
                              </div>
                              {link.price && (
                                <span className="store-price">{link.price}</span>
                              )}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="item-actions">
                      <button
                        className="add-to-cart-item"
                        onClick={() => onAddToCart(convertToProduct(item))}
                      >
                        Add to Vibe Cart
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {analysis.error && (
            <p className="analysis-error">⚠️ {analysis.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
