interface VibeHistoryProps {
  vibeHistory: string[];
  loading: boolean;
  onSelectVibe: (vibe: string) => void;
}

export default function VibeHistory({
  vibeHistory,
  loading,
  onSelectVibe,
}: VibeHistoryProps) {
  if (vibeHistory.length === 0) return null;

  return (
    <div className="vibe-history">
      <span className="vibe-history-title">Recent Vibes:</span>
      <div className="vibe-history-items">
        {vibeHistory.map((pastVibe, index) => (
          <button
            key={index}
            className="vibe-history-item"
            onClick={() => onSelectVibe(pastVibe)}
            disabled={loading}
          >
            {pastVibe}
          </button>
        ))}
      </div>
    </div>
  );
}
