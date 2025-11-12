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
  if (products.length === 0 || loading) return null;

  return (
    <div className="products">
      <h2 className="products-title">Your Vibe Products</h2>
      <div className="product-grid">
        {products.map((product, index) => (
          <div key={index} className="product-card">
            {product.image && (
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
            )}
            <div className="product-emoji">{product.emoji}</div>
            <h3 className="product-name">{product.name}</h3>
            <p className="product-reason">{product.reason}</p>
            <button
              className="add-to-cart"
              onClick={() => onAddToCart(product)}
            >
              Add to Vibe Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
