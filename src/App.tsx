import { useState } from 'react'
import './App.css'

interface Product {
  emoji: string
  name: string
  reason: string
}

const LOADING_MESSAGES = [
  "Consulting your inner chaos...",
  "Reading your aura...",
  "Channeling your main character energy...",
  "Vibing with the universe...",
  "Analyzing your aesthetic...",
  "Summoning your spirit products...",
]

function App() {
  const [vibe, setVibe] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loadingMessage, setLoadingMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vibe.trim()) return

    setLoading(true)
    setError('')
    setProducts([])
    
    // Rotate loading messages
    const messageInterval = setInterval(() => {
      setLoadingMessage(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)])
    }, 1500)

    try {
      const response = await fetch(`http://localhost:3001/api/vibe?query=${encodeURIComponent(vibe)}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch vibe recommendations')
      }

      const data = await response.json()
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      clearInterval(messageInterval)
      setLoading(false)
      setLoadingMessage('')
    }
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">
            <span className="emoji">🛍️</span>
            Vibe to Cart
          </h1>
          <p className="tagline">Tell us your vibe. We'll tell you what to buy.</p>
        </header>

        <form onSubmit={handleSubmit} className="vibe-form">
          <input
            type="text"
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            placeholder="Tell us your vibe... (e.g., villain era, hot mess express)"
            className="vibe-input"
            disabled={loading}
          />
          <button type="submit" className="vibe-button" disabled={loading || !vibe.trim()}>
            {loading ? 'Vibing...' : 'Get My Vibe'}
          </button>
        </form>

        {loadingMessage && (
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

        {products.length > 0 && !loading && (
          <div className="products">
            <h2 className="products-title">Your Vibe Products</h2>
            <div className="product-grid">
              {products.map((product, index) => (
                <div key={index} className="product-card">
                  <div className="product-emoji">{product.emoji}</div>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-reason">{product.reason}</p>
                  <button className="add-to-cart">Add to Vibe Cart</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
