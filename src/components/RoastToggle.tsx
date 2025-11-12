import { useState } from "react";

interface RoastToggleProps {
  roastMode: boolean;
  onToggle: (checked: boolean) => void;
}

export default function RoastToggle({ roastMode, onToggle }: RoastToggleProps) {
  const [showFireOverlay, setShowFireOverlay] = useState(false);
  const [shake, setShake] = useState(false);

  const handleToggle = (checked: boolean) => {
    if (checked) {
      // Roast mode activated - show dramatic effects
      setShowFireOverlay(true);
      setShake(true);
      
      // Play fire sound effect if available
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjGH0fPTgjMGHm7A7+OZURE=');
      audio.volume = 0.3;
      audio.play().catch(() => {}); // Ignore errors if autoplay blocked

      // Remove effects after animation
      setTimeout(() => {
        setShowFireOverlay(false);
        setShake(false);
      }, 800);
    }
    
    onToggle(checked);
  };

  return (
    <>
      {showFireOverlay && <div className="roast-fire-overlay" />}
      <div className={`roast-toggle-container ${shake ? 'roast-screen-shake' : ''}`}>
        <label className="roast-toggle">
          <input
            type="checkbox"
            checked={roastMode}
            onChange={(e) => handleToggle(e.target.checked)}
          />
          <span className="roast-toggle-label">
            {roastMode ? "🔥 Roast Mode" : "💝 Nice Mode"}
          </span>
        </label>
      </div>
    </>
  );
}
