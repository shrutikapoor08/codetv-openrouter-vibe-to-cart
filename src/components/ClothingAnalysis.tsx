import type { ImageAnalysis } from "../types";

interface ClothingAnalysisProps {
  analysis: ImageAnalysis | null;
  loading: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

export default function ClothingAnalysis({
  analysis,
  loading,
  imageUrl,
  onClose,
}: ClothingAnalysisProps) {
  if (!analysis && !loading) return null;

  return (
    <div className="clothing-analysis-section">
      <div className="clothing-analysis-header">
        <div>
          <h2>👔 Outfit Details</h2>
          <p className="analysis-subtitle">🍌 Analyzed by Nano Banana AI</p>
        </div>
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
      </div>

      {loading && (
        <div className="clothing-analysis-loading">
          <div className="loading-spinner"></div>
          <p>Analyzing outfit...</p>
        </div>
      )}

      {analysis && !loading && (
        <div className="clothing-analysis-content">
          {imageUrl && (
            <div className="analyzed-image-container">
              <img
                src={imageUrl}
                alt="Analyzed outfit"
                className="analyzed-image"
              />
            </div>
          )}

          <div className="clothing-items">
            <h3>🎨 Outfit Breakdown ({analysis.items.length} items)</h3>
            <div className="clothing-items-grid">
              {analysis.items.map((item, index) => (
                <div key={index} className="clothing-item-card">
                  {item.imageUrl && (
                    <div className="item-image-container">
                      <img
                        src={item.imageUrl}
                        alt={`${item.color} ${item.style} ${item.type}`}
                        className="item-image"
                      />
                    </div>
                  )}
                  <div className="item-header">
                    <span className="item-number">#{index + 1}</span>
                    <span className="item-type">{item.type}</span>
                  </div>
                  <div className="item-details">
                    <div className="detail-row">
                      <span className="detail-label">Color:</span>
                      <span className="item-color">{item.color}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Style:</span>
                      <span className="item-style">{item.style}</span>
                    </div>
                  </div>

                  {item.shoppingLinks && item.shoppingLinks.length > 0 && (
                    <div className="shopping-links">
                      <div className="shopping-links-header">🛍️ Shop this item:</div>
                      <div className="shopping-links-list">
                        {item.shoppingLinks.map((link, linkIndex) => (
                          <a
                            key={linkIndex}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shopping-link"
                          >
                            <span className="link-icon">🔗</span>
                            <span className="link-title">{link.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="outfit-summary">
            <h4>✨ Overall Aesthetic</h4>
            <p className="clothing-summary">{analysis.summary}</p>
          </div>

          {analysis.error && (
            <p className="analysis-error">
              ⚠️ {analysis.error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
