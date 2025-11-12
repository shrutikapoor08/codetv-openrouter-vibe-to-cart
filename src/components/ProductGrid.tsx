import { useState } from "react";
import type { Product } from "../types";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product) => void;
}

export default function ProductGrid({
  products,
  loading,
  onAddToCart,
}: ProductGridProps) {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  if (products.length === 0 || loading) return null;

  return (
    <div className="products">
      <h2 className="products-title">Your Vibe Products</h2>
      <div className="product-grid">
        {products.map((product, index) => {
          const hasImage = product.image && !imageErrors.has(index);
          
          return (
            <div key={index} className="product-card">
              {hasImage && (
                <div className="product-image">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    onError={() => handleImageError(index)}
                  />
                </div>
              )}
              <h3 className="product-name">{product.name}</h3>
              <p className="product-reason">{product.reason}</p>
              <button
                className="add-to-cart"
                onClick={() => onAddToCart(product)}
              >
                Add to Vibe Cart
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
