import type { Product } from "../types";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  onImageClick?: (imageUrl: string) => void;
}

export default function ProductGrid({
  products,
  loading,
  onImageClick,
}: ProductGridProps) {
  if (products.length === 0 || loading) return null;

  return (
    <div className="products">
      <h2 className="products-title">Your Outfits</h2>
      <div className="product-grid">
        {products.map((product, index) => {
          const hasImage = product.image;

          return (
            <div key={index} className="product-card">
              {hasImage && (
                <div
                  className="product-image clickable"
                  onClick={() => onImageClick?.(product.image!)}
                  title="Click to analyze outfit details"
                >
                  <img src={product.image} alt={product.name} />
                </div>
              )}
              <button
                className="add-to-cart"
                onClick={() => {
                  if (hasImage && onImageClick) {
                    onImageClick(product.image!);
                  }
                }}
              >
                Analyze Outfit
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
