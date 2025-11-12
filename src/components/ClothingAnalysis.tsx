import type { ImageAnalysis } from "../types";

interface ClothingAnalysisProps {
  analysis: ImageAnalysis | null;
  loading: boolean;
  onClose: () => void;
}

export default function ClothingAnalysis({
  analysis,
  loading,
  onClose,
}: ClothingAnalysisProps) {
  if (!analysis && !loading) return null;

  return (
    <div className="clothing-analysis-section">
      <div className="clothing-analysis-header">
        <h2>👔 Outfit Details</h2>
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
          <p className="clothing-summary">{analysis.summary}</p>

          <div className="clothing-items">
            <h3>Identified Items:</h3>
            <ul>
              {analysis.items.map((item, index) => (
                <li key={index} className="clothing-item-detail">
                  <span className="item-type">{item.type}</span>
                  <span className="item-color">{item.color}</span>
                  <span className="item-style">{item.style}</span>
                </li>
              ))}
            </ul>
          </div>

          {analysis.error && (
            <p className="analysis-error">
              Note: {analysis.error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
