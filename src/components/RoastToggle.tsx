import { useState } from "react";

interface RoastToggleProps {
  roastMode: boolean;
  onToggle: (checked: boolean) => void;
}

export default function RoastToggle({
  roastMode,
  onToggle,
}: RoastToggleProps) {
  const [shake, setShake] = useState(false);

  const handleToggle = (checked: boolean) => {
    if (checked) {
      // Roast mode activated - show dramatic effects
      setShake(true);

      // Play fire sound effect if available
      const audio = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjGH0fPTgjMGHm7A7+OZURE="
      );
      audio.volume = 0.3;
      audio.play().catch(() => {}); // Ignore errors if autoplay blocked

      // Remove shake effect after animation
      setTimeout(() => {
        setShake(false);
      }, 800);
    }

    onToggle(checked);
  };

  return (
    <div className="roast-toggle-container">
      <label className={`roast-toggle ${shake ? "roast-toggle-shake" : ""}`}>
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
  );
}

