import type { VibeImage } from "../types";

interface VibeImageGridProps {
  vibeImages: VibeImage[];
  loading: boolean;
  onSelectVibe: (vibeImage: VibeImage) => void;
}

export default function VibeImageGrid({
  vibeImages,
  loading,
  onSelectVibe,
}: VibeImageGridProps) {
  if (vibeImages.length === 0 || loading) return null;

  return (
    <div className="vibe-images-section">
      <h2 className="vibe-images-title">Choose Your Vibe</h2>
      <div className="vibe-image-grid">
        {vibeImages.map((vibeImage) => (
          <div key={vibeImage.id} className="vibe-image-card">
            <div className="vibe-image-container">
              <img
                src={vibeImage.url}
                alt={`Vibe ${vibeImage.id}`}
                className="vibe-image"
              />
            </div>
            <button
              className="choose-vibe-btn"
              onClick={() => onSelectVibe(vibeImage)}
            >
              Choose This Vibe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
