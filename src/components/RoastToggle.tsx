import { useState } from "react";

interface RoastToggleProps {
  roastMode: boolean;
  onToggle: (checked: boolean) => void;
}

export default function RoastToggle({ roastMode, onToggle }: RoastToggleProps) {
  const [shake, setShake] = useState(false);

  const handleToggle = (checked: boolean) => {
    if (checked) {
      // Roast mode activated - show dramatic effects
      setShake(true);

      // Play evil laugh sound effect
      try {
        const audio = new Audio(
          "https://www.myinstants.com/media/sounds/evil-laugh.mp3"
        );
        audio.volume = 0.4;
        audio.play().catch(() => {
          console.log("Audio playback blocked by browser");
        });
      } catch {
        console.log("Audio playback not supported");
      }

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
