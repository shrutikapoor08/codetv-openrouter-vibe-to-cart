import { useState } from "react";

interface RoastToggleProps {
  onRoastClick: () => void;
  disabled?: boolean;
}

export default function RoastToggle({
  onRoastClick,
  disabled = false,
}: RoastToggleProps) {
  const [shake, setShake] = useState(false);

  const handleClick = () => {
    if (disabled) return;

    // Trigger shake animation
    setShake(true);

    // Play fire sound effect if available
    const audio = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjGH0fPTgjMGHm7A7+OZURE="
    );
    audio.volume = 0.3;
    audio.play().catch(() => {}); // Ignore errors if autoplay blocked

    // Call the roast handler
    onRoastClick();

    // Remove shake effect
    setTimeout(() => {
      setShake(false);
    }, 500);
  };

  return (
    <div className="roast-button-container">
      <button
        className={`roast-me-button ${shake ? "roast-button-shake" : ""} ${
          disabled ? "roast-me-button-disabled" : ""
        }`}
        onClick={handleClick}
        disabled={disabled}
      >
        <span className="roast-me-flame">🔥</span>
        <span className="roast-me-text">ROAST ME</span>
        <span className="roast-me-flame">🔥</span>
      </button>
      {disabled && (
        <p className="roast-me-hint">Add items to cart to get roasted!</p>
      )}
    </div>
  );
}

