import { useState } from 'react'
import './App.css'

interface ImageResult {
  imageUrl: string
  prompt: string
  originalVibe: string
  aspectRatio: string
  message?: string
}

function App() {
  const [vibe, setVibe] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageResult, setImageResult] = useState<ImageResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [aspectRatio, setAspectRatio] = useState('1:1')

  const loadingMessages = [
    "Channeling your vibe...",
    "Consulting the vibe oracle...",
    "Mixing colors and emotions...",
    "Creating art from feels...",
    "Translating vibes to pixels...",
    "Summoning the aesthetic gods...",
  ]

  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0])

  const handleGenerateImage = async () => {
    if (!vibe.trim()) {
      setError("Please enter a vibe first!")
      return
    }

    setLoading(true)
    setError(null)
    setImageResult(null)

    // Rotate loading messages
    const interval = setInterval(() => {
      setLoadingMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)])
    }, 2000)

    try {
      const response = await fetch('http://localhost:3001/vibe-to-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vibe, aspectRatio }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image')
      }

      setImageResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleGenerateImage()
    }
  }

  return (
    <div className="app-container">
      <div className="content">
        <h1 className="title">Vibe to Image</h1>
        <p className="subtitle">Transform your vibes into visual art with AI</p>

        <div className="input-section">
          <textarea
            className="vibe-input"
            placeholder="Tell us your vibe... (e.g., 'villain era', 'hot mess express', 'midnight chaos energy')"
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={3}
            disabled={loading}
          />

          <div className="aspect-ratio-selector">
            <label>Aspect Ratio:</label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              disabled={loading}
            >
              <option value="1:1">Square (1:1)</option>
              <option value="16:9">Landscape (16:9)</option>
              <option value="9:16">Portrait (9:16)</option>
              <option value="4:3">Classic (4:3)</option>
              <option value="3:4">Tall (3:4)</option>
            </select>
          </div>

          <button
            className="generate-button"
            onClick={handleGenerateImage}
            disabled={loading || !vibe.trim()}
          >
            {loading ? loadingMessage : 'Generate My Vibe'}
          </button>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {imageResult && (
          <div className="image-result">
            <h2>Your Vibe, Visualized</h2>
            <div className="image-container">
              <img
                src={imageResult.imageUrl}
                alt={`Generated image for: ${imageResult.originalVibe}`}
                className="generated-image"
              />
            </div>
            <div className="image-info">
              <p className="vibe-text">
                <strong>Original Vibe:</strong> {imageResult.originalVibe}
              </p>
              <p className="aspect-text">
                <strong>Aspect Ratio:</strong> {imageResult.aspectRatio}
              </p>
              {imageResult.message && (
                <p className="message-text">{imageResult.message}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
