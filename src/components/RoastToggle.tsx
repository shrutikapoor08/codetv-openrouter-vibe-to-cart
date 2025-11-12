interface RoastToggleProps {
  roastMode: boolean;
  onToggle: (checked: boolean) => void;
}

export default function RoastToggle({ roastMode, onToggle }: RoastToggleProps) {
  return (
    <div className="roast-toggle-container">
      <label className="roast-toggle">
        <input
          type="checkbox"
          checked={roastMode}
          onChange={(e) => onToggle(e.target.checked)}
        />
        <span className="roast-toggle-label">
          {roastMode ? "🔥 Roast Mode" : "💝 Nice Mode"}
        </span>
      </label>
    </div>
  );
}
