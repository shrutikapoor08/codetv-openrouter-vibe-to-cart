import { forwardRef, type FormEvent } from "react";

interface VibeFormProps {
  vibe: string;
  loading: boolean;
  easterEggMessage: string;
  onVibeChange: (vibe: string) => void;
  onSubmit: (e: FormEvent) => void;
  onSurpriseMe: () => void;
}

const VibeForm = forwardRef<HTMLFormElement, VibeFormProps>(
  (
    { vibe, loading, easterEggMessage, onVibeChange, onSubmit, onSurpriseMe },
    ref
  ) => {
    return (
      <form ref={ref} onSubmit={onSubmit} className="vibe-form">
        <div className="vibe-input-container">
          <input
            type="text"
            value={vibe}
            onChange={(e) => onVibeChange(e.target.value)}
            placeholder="Tell us your vibe... (e.g., villain era, hot mess express)"
            className="vibe-input"
            disabled={loading}
          />
          {easterEggMessage && (
            <div className="easter-egg">{easterEggMessage}</div>
          )}
        </div>
        <button
          type="submit"
          className="vibe-button"
          disabled={loading || !vibe.trim()}
        >
          {loading ? "Vibing..." : "Get My Vibe"}
        </button>
        <button
          type="button"
          className="surprise-button"
          onClick={onSurpriseMe}
          disabled={loading}
        >
          🎲 Surprise Me
        </button>
      </form>
    );
  }
);

VibeForm.displayName = "VibeForm";

export default VibeForm;
