# 🛍️ Vibe to Cart

> **Tell us your vibe. We'll tell you what to buy.**

A silly, fun AI-powered e-commerce experience that transforms user "vibes" into hilarious product recommendations using OpenRouter's multi-model capabilities and LangChain orchestration.

## 🎯 What is This?

Stop shopping by boring categories like "Electronics" or "Home & Garden." Start shopping by **emotional state**.

Type in vibes like:

- "I'm in my villain era"
- "Hot girl autumn but broke"
- "Cottagecore CEO"
- "Post-apocalyptic brunch influencer"

Get AI-generated product recommendations with sassy commentary:

- 🕶️ "Sunglasses so dark even your emotions can't escape."
- 🖤 "Black hoodie, oversized — for emotional support and mysterious exits."
- 💅 "Therapy not included."

Built for a 4-hour hackathon. Optimized for laughs.

---

## 📚 Documentation

- **[REQUIREMENTS.md](./REQUIREMENTS.md)** - Project requirements, features, timeline, and TODO list
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture, system design, and implementation details
- **[CLAUDE.md](./CLAUDE.md)** - Guide for AI coding agents working on this project

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v24+)
- npm
- OpenRouter API key ([Get one here](https://openrouter.ai/keys))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/shrutikapoor08/codetv-openrouter-vibe-to-cart.git
   cd codetv-openrouter-vibe-to-cart
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your API key:

   ```bash
   MOCK_MODE=false  # Set to true for testing without API calls
   OPENROUTER_API_KEY=your-key-here
   ```

   > **Note:** The backend server uses Node.js's native `--env-file` flag (Node 20.6+) to load environment variables from `.env`. The `npm run server` script handles this automatically.

4. **Start the development servers**

   Terminal 1 - Frontend:

   ```bash
   npm run dev
   ```

   Terminal 2 - Backend:

   ```bash
   npm run server
   ```

5. **Open in browser**
   ```bash
   open http://localhost:5173/
   ```

---

## 🎮 Mock Mode (Testing Without API Keys)

Don't have API keys yet? No problem!

```bash
# In .env
MOCK_MODE=true
```

Mock mode returns pre-defined responses without making actual API calls. Perfect for:

- ✅ Testing the UI
- ✅ Developing without API costs
- ✅ Demo rehearsals without live API dependency

---

## 🏗️ Tech Stack

| Layer                | Technology                             | Purpose                   |
| -------------------- | -------------------------------------- | ------------------------- |
| **Frontend**         | React + TypeScript + Vite              | UI framework & build tool |
| **Backend**          | Node.js + Express                      | HTTP server & API routing |
| **AI Orchestration** | LangChain + LangGraph                  | Agent workflow management |
| **AI Models**        | OpenRouter (GPT-4o-mini, Claude, etc.) | Multi-model LLM access    |
| **Styling**          | TailwindCSS (planned)                  | Rapid UI development      |

---

## 🔧 Available Scripts

```bash
npm run dev       # Start Vite dev server (frontend)
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
npm run server    # Start Express backend server
```

**Backend (alternative):**

```bash
npm run server                      # Start Express server (production mode)
MOCK_MODE=true npm run server       # Start with mock mode
PORT=3002 npm run server            # Start on different port
```

---

## 📁 Project Structure

```
codetv-openrouter-vibe-to-cart/
├── src/
│   ├── api/                        # Backend (Express + LangChain)
│   │   ├── server.js              # Express server entry point
│   │   ├── config/                # Configuration
│   │   │   ├── env.js            # Environment variables
│   │   │   └── apiKeyValidation.js
│   │   ├── services/              # Business logic
│   │   │   ├── aiAgent.js        # LangChain AI agent
│   │   │   ├── imageGeneration.js # OpenRouter image gen
│   │   │   ├── vibeService.js    # Vibe caching
│   │   │   └── imageService.js   # Image caching
│   │   ├── middleware/            # Express middleware
│   │   │   ├── cors.js
│   │   │   ├── errorHandler.js
│   │   │   └── validators.js
│   │   ├── routes/                # HTTP routes
│   │   │   ├── vibeRoutes.js
│   │   │   ├── imageRoutes.js
│   │   │   └── cacheRoutes.js
│   │   └── utils/                 # Shared utilities
│   │       ├── paths.js
│   │       └── mockData.js
│   ├── components/                # React components
│   ├── hooks/                     # Custom React hooks
│   ├── App.tsx                    # Main React component
│   ├── main.tsx                   # React entry point
│   └── constants.ts               # Frontend constants
├── public/                         # Public static files
│   └── images/                    # AI-generated product images
├── .cache/                         # Vibe cache (gitignored)
├── .env                           # Environment variables (gitignored)
├── .env.example                    # Environment template
├── REQUIREMENTS.md                 # Project requirements & roadmap
├── ARCHITECTURE.md                 # Technical architecture docs
├── AGENTS.md                       # General AI agent guide
└── README.md                       # This file
```

**Note:** The backend follows a **service-oriented architecture** for better code organization. See [ARCHITECTURE.md](./ARCHITECTURE.md) for details.

---

## 🛣️ API Endpoints

### `GET /agent`

Process user vibe and return AI-generated recommendations.

**Request:**

```http
GET /agent?query=I'm in my villain era
```

**Response:**

```
Plain text response with AI-generated recommendations
```

**Error Codes:**

- `400` - Missing or empty query parameter
- `500` - AI processing error

---

## 🎨 Features

### Current (MVP)

✅ AI-powered vibe processing via OpenRouter  
✅ Web search integration with Tavily  
✅ Mock mode for testing  
✅ Environment-based configuration  
✅ Error handling & validation

### Planned (See REQUIREMENTS.md)

- 🎨 Beautiful UI with product cards
- 🎭 Multi-model "Vibe Committee" (Claude, GPT-4, Mistral debate)
- 🛒 Fake shopping cart with confetti
- 😈 "Roast Mode" - AI roasts your vibe instead
- 🔮 "Future You" predictor
- 🎲 "Surprise Me" random vibe generator
- 📜 Vibe history tracking

---

## 🤝 Contributing

This is a hackathon project, but contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🐛 Troubleshooting

### SSL Certificate Errors

If you see `SELF_SIGNED_CERT_IN_CHAIN` errors:

- This is a development workaround for corporate proxies
- Set in `src/api/agent.js`: `process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"`
- ⚠️ **Remove in production** or make conditional via environment variable

### API Key Validation Fails

```bash
❌ ERROR: Missing required API keys:
   - OPENROUTER_API_KEY
```

**Solutions:**

1. Check `.env` exists and has valid keys
2. Restart the server after adding keys
3. Use `MOCK_MODE=true` to bypass validation

### Port Already in Use

If port 3001 is taken:

```bash
PORT=3002 npm run server
```

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- Built for a 4-hour hackathon challenge
- Powered by [OpenRouter](https://openrouter.ai/)
- Web search by [Tavily](https://tavily.com/)
- Orchestration by [LangChain](https://www.langchain.com/)
- Inspired by the chaos of modern e-commerce

---

## 📞 Contact

**Project Maintainers:** [shrutikapoor08](https://github.com/shrutikapoor08) and [mstuart](https://github.com/mstuart)

**Repository:** [codetv-openrouter-vibe-to-cart](https://github.com/shrutikapoor08/codetv-openrouter-vibe-to-cart)

---

**Made with ☕ and questionable life choices.**
