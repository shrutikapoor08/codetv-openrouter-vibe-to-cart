interface StatusDisplayProps {
  loading?: boolean;
  loadingMessage?: string;
  error?: string;
}

/**
 * Component for displaying loading and error states
 */
export default function StatusDisplay({
  loading,
  loadingMessage,
  error,
}: StatusDisplayProps) {
  if (!loading && !error) return null;

  return (
    <>
      {loading && loadingMessage && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p className="loading-text">{loadingMessage}</p>
        </div>
      )}

      {error && (
        <div className="error">
          <p>❌ {error}</p>
        </div>
      )}
    </>
  );
}
