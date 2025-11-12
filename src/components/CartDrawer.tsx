import type { Product } from "../types";

interface CartDrawerProps {
  show: boolean;
  cartCount: number;
  cartItems: Product[];
  onClose: () => void;
  onRemoveItem: (index: number) => void;
}

export default function CartDrawer({
  show,
  cartCount,
  cartItems,
  onClose,
  onRemoveItem,
}: CartDrawerProps) {
  if (!show) return null;

  return (
    <div className="cart-drawer">
      <div className="cart-header">
        <h3>🛒 Vibe Cart ({cartCount})</h3>
        <button className="cart-close" onClick={onClose}>
          ✕
        </button>
      </div>
      <div className="cart-items">
        {cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-image"
              />
            ) : (
              <span className="cart-item-emoji">{item.emoji}</span>
            )}
            <span className="cart-item-name">{item.name}</span>
            <button
              className="cart-item-remove"
              onClick={() => onRemoveItem(index)}
              aria-label="Remove item"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
