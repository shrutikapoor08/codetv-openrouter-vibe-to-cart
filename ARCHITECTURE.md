# Vibe to Cart - Architecture Documentation

## 🏗️ System Overview

**Vibe to Cart** is a full-stack web application that transforms user "vibes" into AI-generated product recommendations using OpenRouter's multi-model capabilities and LangChain for intelligent orchestration.

### High-Level Architecture

```mermaid
graph TD
    A[React UI<br/>Vite + TypeScript] -->|HTTP Request| B[Express API<br/>Node.js]
    B --> D[LangGraph Agent]
    B --> G[Image Generation<br/>Service]
    D --> E[OpenRouter API<br/>Text: GPT-4o-mini]
    D --> F[Tavily Search<br/>Web search tool]
    G --> H[OpenRouter API<br/>Images: Gemini-Flash-Image]
    E -->|AI Response| D
    F -->|Search Results| D
    D -->|Products JSON| B
    H -->|Generated Image| G
    G -->|Image URL| B
    B -->|JSON/Images| A

    style A fill:#e1f5ff
    style B fill:#fff4e1
    style D fill:#f0e1ff
    style E fill:#ffe1e1
    style F fill:#e1ffe1
    style G fill:#ffe8f0
    style H fill:#ffe1e1
```

---

## 📦 Technology Stack

### Frontend

| Technology      | Version | Purpose                                    |
| --------------- | ------- | ------------------------------------------ |
| **React**       | 19.2.0  | UI framework                               |
| **TypeScript**  | Latest  | Type safety                                |
| **Vite**        | Latest  | Build tool & dev server                    |
| **Custom CSS**  | -       | Styling with dynamic theme switching       |

### Backend

| Technology  | Version | Purpose               |
| ----------- | ------- | --------------------- |
| **Node.js** | Latest  | Runtime environment   |
| **Express** | 5.1.0   | HTTP server & routing |

### AI & Orchestration

| Technology           | Version | Purpose                          |
| -------------------- | ------- | -------------------------------- |
| **LangChain Core**   | 1.0.4   | Message handling & primitives    |
| **LangGraph**        | 1.0.2   | Agent workflow orchestration     |
| **LangChain OpenAI** | 1.1.0   | OpenRouter/OpenAI integration    |
| **OpenRouter SDK**   | 0.1.11  | Official OpenRouter SDK          |
| **OpenRouter API**   | -       | Multi-model LLM & image access   |

**OpenRouter Models Used:**

- **Text Generation:**
  - `openai/gpt-4o-mini` - Product recommendations, cart roasts
  - `openai/gpt-4o-mini:online` - Web-enabled product image search
  
- **Image Generation & Analysis:**
  - `google/gemini-2.5-flash-image` - Outfit image generation, clothing analysis

### Key Features

- **Dual Theme System** - CSS-based theme switching (Normal/Roast modes)
- **Sound Effects** - Web Audio API evil laugh on Roast Mode activation
- **Multi-Model AI** - Different models for different tasks (text, images, vision)
- **Smart Caching** - Three-tier caching: vibes, images, and analysis results
- **Mock Mode** - Complete testing without API keys

---

## 🔄 Request Flow

### 1. User Interaction Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Express
    participant Agent
    participant ImageGen
    participant OpenRouter
    participant Tavily

    User->>Frontend: Enter vibe (e.g., "villain era")
    Frontend->>Frontend: Validate input
    Frontend->>Express: GET /api/vibe?vibe=villain+era
    Express->>Express: Validate query parameter
    Express->>Agent: webSearchAgent({description})

    alt Mock Mode Enabled
        Agent->>Express: Return mock response
    else Production Mode
        Agent->>OpenRouter: Generate recommendations (gpt-4o-mini)
        OpenRouter-->>Agent: Products JSON
        Agent->>Express: Return products array
    end

    Express->>Frontend: Products JSON response

    loop For each product
        Frontend->>Express: GET /api/product-image?name=<product>
        Express->>ImageGen: generateProductImage({productName})
        ImageGen->>OpenRouter: Generate image (gemini-2.5-flash-image)
        OpenRouter-->>ImageGen: PNG image data
        ImageGen->>ImageGen: Cache image to disk
        ImageGen->>Express: Return image URL
        Express->>Frontend: Image URL
    end

    Frontend->>User: Display product cards with images
```

**Detailed Steps:**

1. **User enters vibe** (e.g., "I'm in my villain era")
2. **Frontend sends GET request** to `/api/vibe?vibe=<vibe>&roastMode=<boolean>`
3. **Express server validates** query parameter
4. **Server calls** `webSearchAgent({ description, roastMode })`
5. **Agent calls** OpenRouter GPT-4o-mini for product recommendations
6. **Response returns** as JSON array of products
7. **Frontend displays** product recommendations
8. **User clicks outfit** to trigger image generation and analysis

### 2. Image Analysis Flow

**When user clicks "Analyze Outfit":**

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Express
    participant ImageAnalysis
    participant OpenRouter

    User->>Frontend: Click "Analyze Outfit" on product card
    Frontend->>Express: POST /api/analyze-image {imageUrl}
    Express->>ImageAnalysis: analyzeImage(imageUrl)
    ImageAnalysis->>OpenRouter: Vision API (gemini-2.5-flash-image)
    OpenRouter-->>ImageAnalysis: Clothing items JSON
    
    loop For each clothing item
        ImageAnalysis->>OpenRouter: Search for product image (gpt-4o-mini:online)
        OpenRouter-->>ImageAnalysis: Product image URL
    end
    
    ImageAnalysis->>Express: Return analysis + images
    Express->>Frontend: Clothing items with images
    Frontend->>User: Display analyzed outfit items
```

### 3. Cart Roast Flow

**When Roast Mode is active and items are in cart:**

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Express
    participant Agent
    participant OpenRouter

    User->>Frontend: Add items to cart (Roast Mode ON)
    Frontend->>Express: POST /api/roast-cart {cartItems[]}
    Express->>Agent: roastCart({cartItems})
    Agent->>OpenRouter: Generate roast (gpt-4o-mini)
    OpenRouter-->>Agent: Roast message
    Agent->>Express: Return roast text
    Express->>Frontend: Roast message
    Frontend->>User: Display roast in modal
```

### 4. API Endpoint Architecture

#### `GET /api/vibe`

**Purpose:** Process user vibe and return AI-generated product recommendations

**Request Format:**

```http
GET /api/vibe?vibe=villain+era&roastMode=false HTTP/1.1
```

**Response Format:**

```json
{
  "products": [
    {
      "emoji": "🖤",
      "name": "Oversized Black Hoodie",
      "reason": "For mysterious exits and emotional support",
      "imageUrl": "data:image/png;base64,..."
    }
  ]
}
```

**Error Handling:**

- 400: Missing or invalid vibe parameter
- 500: AI processing error (with detailed error info)

**Code Location:** `src/api/routes/vibeRoutes.js`, `src/api/services/aiAgent.js`

#### `POST /api/roast-cart`

**Purpose:** Roast user's cart choices with AI humor

**Request Format:**

```json
{
  "cartItems": [
    {
      "name": "Oversized Black Hoodie",
      "emoji": "🖤",
      "reason": "For emotional support"
    }
  ]
}
```

**Response Format:**

```json
{
  "roast": "Oh honey, a black hoodie? How original. Let me guess, you're going through a phase?..."
}
```

**Code Location:** `src/api/routes/vibeRoutes.js`

#### `POST /api/product-image`

**Purpose:** Generate AI image for a product

**Request Format:**

```json
{
  "productName": "Oversized Black Hoodie",
  "vibe": "villain era"
}
```

**Response Format:**

```json
{
  "imageUrl": "data:image/png;base64,...",
  "message": "Image generated successfully"
}
```

**Code Location:** `src/api/routes/imageRoutes.js`, `src/api/services/imageGeneration.js`

#### `POST /api/analyze-image`

**Purpose:** Analyze outfit image and extract clothing items

**Request Format:**

```json
{
  "imageUrl": "https://example.com/outfit.jpg"
}
```

**Response Format:**

```json
{
  "items": [
    {
      "type": "jacket",
      "color": "black",
      "style": "leather bomber",
      "imageUrl": "https://...",
      "shoppingLinks": [
        {
          "store": "ASOS",
          "url": "https://...",
          "searchQuery": "black leather bomber jacket"
        }
      ]
    }
  ],
  "summary": "A cohesive outfit featuring modern streetwear elements..."
}
```

**Code Location:** `src/api/routes/imageAnalysisRoutes.js`, `src/api/services/imageAnalysis.js`

#### Cache Management Endpoints

- `GET /api/image-cache-stats` - Get product image cache statistics
- `GET /api/vibe-cache-stats` - Get vibe recommendations cache statistics
- `POST /api/clear-vibe-cache` - Clear vibe cache
- `GET /api/vibe-image-cache-stats` - Get vibe image cache statistics
- `POST /api/clear-vibe-image-cache` - Clear vibe image cache
- `GET /api/image-analysis-cache-stats` - Get analysis cache statistics
- `POST /api/clear-image-analysis-cache` - Clear analysis cache

---

## 🤖 AI Agent Architecture

### Agent Components

The `webSearchAgent` (located in `src/api/services/aiAgent.js`) uses **direct OpenRouter model invocation** (no web search tools in current version):

```mermaid
flowchart TD
    Start([User Query + Roast Mode]) --> MockCheck{MOCK_MODE?}

    MockCheck -->|Yes| MockResponse[Return Mock Response<br/>500ms delay]
    MockCheck -->|No| CreatePrompt[Create Vibe Prompt]

    CreatePrompt --> RoastCheck{Roast Mode?}
    RoastCheck -->|Yes| RoastPrompt[Add Roast Instructions]
    RoastCheck -->|No| NicePrompt[Add Recommendation Instructions]

    RoastPrompt --> ModelInit[OpenRouter Model<br/>gpt-4o-mini]
    NicePrompt --> ModelInit

    ModelInit --> Invoke[model.invoke]

    Invoke --> ParseResponse[Parse JSON Response]
    ParseResponse --> AddImages[Generate Product Images<br/>gemini-2.5-flash-image]

    AddImages --> Response[Products with Images]
    MockResponse --> End([Return to User])
    Response --> End

    style MockResponse fill:#ffe1e1
    style CreateAgent fill:#e1f5ff
    style ReAct fill:#f0e1ff
    style Response fill:#e1ffe1
```

### Agent Configuration

**File:** `src/api/agent.js`

**Key Components:**

1. **LLM (Language Model)**

   ```javascript
   new ChatOpenAI({
     model: "openai/gpt-4o-mini",
     temperature: 0,
     apiKey: process.env.OPENROUTER_API_KEY,
     configuration: {
       baseURL: "https://openrouter.ai/api/v1",
       defaultHeaders: {
         "HTTP-Referer":
           "https://github.com/shrutikapoor08/codetv-openrouter-vibe-to-cart",
         "X-Title": "Vibe to Cart",
       },
     },
   });
   ```

2. **Tools**

   ```javascript
   new TavilySearch({
     maxResults: 3,
     tavilyApiKey: process.env.TAVILY_API_KEY,
   });
   ```

3. **Memory**

   ```javascript
   new MemorySaver(); // Persists conversation state
   ```

4. **Agent Creation**
   ```javascript
   createReactAgent({
     llm: agentModel,
     tools: [webTool],
     checkpointSaver: agentCheckpointer,
   });
   ```

### ReAct Agent Pattern

**ReAct** = **Rea**soning + **Act**ing

The agent follows this loop:

1. **Reason:** Analyze the user's vibe/query
2. **Act:** Decide if tools (Tavily search) are needed
3. **Observe:** Process tool results
4. **Respond:** Generate final recommendation

---

## � Backend Directory Structure

The backend follows a **service-oriented architecture** for better separation of concerns and maintainability:

```
src/api/
├── server.js                      # Main Express server entry point
│
├── config/                        # Configuration and validation
│   ├── env.js                    # Centralized environment variables
│   └── apiKeyValidation.js       # API key validation logic
│
├── services/                      # Core business logic
│   ├── aiAgent.js                # LangChain ReAct agent (product generation)
│   ├── imageGeneration.js        # OpenRouter image generation
│   ├── vibeService.js            # Vibe caching service
│   └── imageService.js           # Product image caching service
│
├── middleware/                    # Express middleware
│   ├── cors.js                   # CORS configuration
│   ├── errorHandler.js           # Centralized error handling
│   └── validators.js             # Request validation middleware
│
├── routes/                        # Route handlers
│   ├── vibeRoutes.js             # /api/vibe endpoints
│   ├── imageRoutes.js            # /api/product-image endpoints
│   └── cacheRoutes.js            # Cache management endpoints
│
└── utils/                         # Shared utilities
    ├── paths.js                  # Path resolution helpers
    └── mockData.js               # Mock responses for testing
```

### Key Design Principles

**1. Separation of Concerns**

- **Config**: Environment and validation
- **Services**: Business logic and external integrations
- **Middleware**: Request processing and error handling
- **Routes**: HTTP endpoint definitions
- **Utils**: Shared utilities and test data

**2. Centralized Configuration**

- `config/env.js` exports all environment variables
- Single source of truth for `MOCK_MODE`, API keys, etc.
- Prevents duplication across files

**3. Reusable Utilities**

- `utils/paths.js` provides `getDirname()` and common path constants
- Eliminates repeated `fileURLToPath` boilerplate

**4. Service Layer Pattern**

- Services encapsulate business logic
- Easy to test in isolation
- Clear dependencies and interfaces

### Image Generation Pipeline

**Service:** `services/imageGeneration.js`

The app generates unique product images for each AI-recommended product using OpenRouter's image generation API.

**Flow:**

```mermaid
flowchart TD
    A[Product Name] --> B{Check Image Cache}
    B -->|Cached| C[Return Cached Image URL]
    B -->|Not Cached| D[Create Prompt]
    D --> E[Clean Prompt Text]
    E --> F[POST to OpenRouter<br/>gemini-2.5-flash-image]
    F --> G[Receive Base64 PNG]
    G --> H[Decode to Buffer]
    H --> I[Generate MD5 Hash]
    I --> J[Save to public/images/]
    J --> K[Return Image URL]

    style C fill:#e1ffe1
    style K fill:#e1ffe1
    style F fill:#ffe1e1
```

**Key Features:**

1. **Prompt Cleaning**: Strips emojis and special characters for better image results
2. **Caching**: Images are cached by MD5 hash to avoid regenerating identical products
3. **Mock Mode Support**: Returns placeholder image URL when `MOCK_MODE=true`
4. **Error Resilience**: Falls back gracefully if image generation fails

**OpenRouter Image API Call:**

```javascript
const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://github.com/...",
    "X-Title": "Vibe to Cart",
  },
  body: JSON.stringify({
    model: "google/gemini-2.5-flash-image",
    messages: [
      {
        role: "user",
        content: `Generate a product image for: ${cleanPrompt}`,
      },
    ],
  }),
});
```

**Caching Strategy:**

- **Vibe Cache** (`services/vibeService.js`): Caches AI-generated product recommendations
- **Image Cache** (`services/imageService.js`): Caches product images by filename hash
- Both use JSON files in `.cache/` directory for persistence

---

## � Security & Configuration

### Environment Variables

**File:** `.env` (gitignored)

```bash
# Mock Mode - Bypass API calls for testing
MOCK_MODE=true

# OpenRouter API Key - Multi-model LLM access
OPENROUTER_API_KEY=sk-or-v1-...

# Tavily API Key - Web search functionality
TAVILY_API_KEY=tvly-dev-...

# Server Port (optional)
PORT=3001
```

### Validation Layer

**File:** `src/api/config/apiKeyValidation.js`

**Purpose:** Ensures required API keys are present before server starts

**Logic:**

- If `MOCK_MODE=true`: Skip validation
- If `MOCK_MODE=false`: Require `OPENROUTER_API_KEY` and `TAVILY_API_KEY`
- Exit with error code 1 if keys missing

**Benefits:**

- Prevents runtime failures
- Clear error messages for developers
- Supports mock mode for testing without API costs

---

## 🎭 Mock Mode Architecture

**Purpose:** Enable testing and development without consuming API credits

### Mock Mode Flow

```mermaid
flowchart LR
    A[User Request] --> B{MOCK_MODE<br/>enabled?}
    B -->|true| C[Check Mock<br/>Responses Dict]
    C --> D{Match<br/>Found?}
    D -->|Yes| E[Return Specific<br/>Mock Response]
    D -->|No| F[Return Default<br/>Mock Response]
    E --> G[Simulate 500ms<br/>API Delay]
    F --> G
    G --> H[Return to Client]
    B -->|false| I[Call Real<br/>OpenRouter API]

    style C fill:#ffe1e1
    style G fill:#fff4e1
    style I fill:#e1ffe1
```

**Implementation:**

```javascript
const MOCK_MODE = process.env.MOCK_MODE === "true";

if (MOCK_MODE) {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
  return mockResponses[description] || mockResponses.default;
}
```

**Mock Data Structure:**

```javascript
const mockResponses = {
  "Where is San Jose?": "San Jose is located in...",
  default: "This is a mock response...",
};
```

**Benefits:**

- Zero API costs during development
- Predictable responses for testing
- Faster iteration cycles
- Safe for demos without API key exposure

---

## 📁 Project Structure

```
codetv-openrouter-vibe-to-cart/
│
├── src/
│   ├── api/
│   │   ├── server.js          # Express server & routes
│   │   ├── agent.js           # LangGraph AI agent
│   │   └── validation.js      # API key validation
│   │
│   ├── assets/                # Static assets
│   ├── App.tsx                # Main React component
│   ├── App.css                # Component styles
│   ├── main.tsx               # React entry point
│   └── index.css              # Global styles
│
├── public/                    # Public static files
│
├── .env                       # Environment variables (gitignored)
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
│
├── package.json               # Dependencies & scripts
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Vite build config
│
├── REQUIREMENTS.md            # Project requirements & features
├── ARCHITECTURE.md            # This file
└── README.md                  # Project overview
```

---

## 🔌 API Integration Details

### OpenRouter Integration

**Base URL:** `https://openrouter.ai/api/v1`

**Why OpenRouter?**

- ✅ Access to multiple models (GPT-4, Claude, Mistral, etc.)
- ✅ Single API for model switching
- ✅ Competitive pricing
- ✅ No vendor lock-in
- ✅ Supports both text and image generation

**OpenRouter Usage in This Project:**

1. **Text Generation (Product Recommendations)**

   - Service: `services/aiAgent.js`
   - Model: `openai/gpt-4o-mini`
   - Purpose: Generate funny product recommendations from user vibes
   - Integration: Via LangChain's ChatOpenAI adapter

2. **Image Generation (Product Images)**
   - Service: `services/imageGeneration.js`
   - Model: `google/gemini-2.5-flash-image`
   - Purpose: Generate unique product images for each recommendation
   - Integration: Direct HTTP POST to OpenRouter

**Configuration:**

```javascript
configuration: {
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://github.com/...",  // Required by OpenRouter
    "X-Title": "Vibe to Cart"                   // App identification
  }
}
```

**Text Models Available:**

- `openai/gpt-4o-mini` ✅ (currently used)
- `anthropic/claude-3.5-sonnet`
- `meta-llama/llama-3.1-70b-instruct`
- `google/gemini-pro`
- `mistralai/mistral-large`

**Image Models Available:**

- `google/gemini-2.5-flash-image` ✅ (currently used)
- `black-forest-labs/flux-1.1-pro`
- `openai/dall-e-3`
- `stability-ai/stable-diffusion-xl`

### Tavily Search Integration

**Purpose:** Enable AI to search the web for real-time information

**Configuration:**

```javascript
new TavilySearch({
  maxResults: 3,
  tavilyApiKey: process.env.TAVILY_API_KEY,
});
```

**Use Cases:**

- Product research
- Real-time trends
- Location-based queries
- Price checking (future)

---

## 🚀 Deployment Architecture

### Development Mode

```bash
# Terminal 1: Frontend dev server
npm run dev

# Terminal 2: Backend server
npm run server
```

**Ports:**

- Frontend: `http://localhost:5173` (Vite default)
- Backend: `http://localhost:3001`

### Production Considerations

**Frontend Hosting:**

- Vercel (recommended)
- Netlify
- GitHub Pages

**Backend Hosting:**

- Vercel Serverless Functions
- AWS Lambda
- Railway
- Render

**Environment Variables:**

- Set via hosting platform dashboard
- Never commit `.env` to git
- Use `.env.example` as template

---

## 🔄 Planned Architecture Enhancements

### Multi-Model "Vibe Committee"

**Concept:** Call multiple AI models simultaneously for different perspectives

```mermaid
flowchart TD
    A[User Vibe Input] --> B[Split Request]
    B --> C[Claude API<br/>Artsy Bot 🎨]
    B --> D[GPT-4 API<br/>Logic Bot 🧠]
    B --> E[Mistral API<br/>Chaos Bot 😈]

    C --> F[Parallel Execution]
    D --> F
    E --> F

    F --> G[Merge Responses]
    G --> H[Format as Conversation]
    H --> I[Display Chat Bubbles]

    style C fill:#e1f5ff
    style D fill:#ffe1e1
    style E fill:#f0e1ff
    style H fill:#e1ffe1
```

**Implementation Plan:**

```javascript
async function vibeCommittee(vibe) {
  const [claude, gpt4, mistral] = await Promise.all([
    callModel("claude-3.5-sonnet", vibe),
    callModel("gpt-4.1", vibe),
    callModel("mistral-large", vibe),
  ]);

  return formatAsConversation([claude, gpt4, mistral]);
}
```

### "Explain My Cart" Feature

**Flow:**

```mermaid
graph LR
    A[Cart Items] --> B[AI Analysis<br/>Prompt]
    B --> C[OpenRouter<br/>Processing]
    C --> D[Personality<br/>Description]
    D --> E[Display Roast<br/>to User]

    style C fill:#f0e1ff
    style D fill:#ffe1e1
```

**Prompt:**

> "Analyze these products and roast what they say about this person."

### "Future You" Predictor

**Flow:**

```mermaid
graph LR
    A[Vibe Input] --> C[AI Narrative<br/>Generator]
    B[Cart Items] --> C
    C --> D[6-Month<br/>Prediction]
    D --> E[Display Story<br/>to User]

    style C fill:#f0e1ff
    style D fill:#e1ffe1
```

**Example Output:**

> "In 6 months you'll have 3 candles named after emotions and a cat named Anxiety."

---

## 🛡️ Error Handling Strategy

### Frontend Errors

- Empty query validation
- Network timeout handling
- Graceful fallbacks for API failures

### Backend Errors

- Detailed error logging (console)
- Structured error responses (JSON)
- API key validation at startup
- Tool failure recovery

### AI Agent Errors

- Retry logic (maxRetries: 2)
- Fallback responses if tools fail
- Mock mode as safe fallback
- Conversation state preservation

---

## 📊 Performance Considerations

### Current Optimizations

- ✅ Mock mode for zero-latency testing
- ✅ Memory persistence for conversation context
- ✅ Parallel tool execution where possible

### Future Optimizations

- [ ] Response caching (Redis)
- [ ] Streaming responses (SSE)
- [ ] Request rate limiting
- [ ] CDN for static assets
- [ ] Database for vibe history

---

## 🔧 Development Workflow

### 1. Local Development

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your API keys to .env

# Run in mock mode (no API keys needed)
MOCK_MODE=true npm run server

# Run with real APIs
npm run server
```

### 2. Testing Strategy

- **Unit Tests:** Validation logic, mock responses
- **Integration Tests:** API endpoint behavior
- **E2E Tests:** Full user flow (future)
- **Manual Testing:** Various vibe inputs

### 3. Code Quality

- ESLint for linting
- TypeScript for type safety (frontend)
- Prettier for formatting (future)
- Git hooks for pre-commit checks (future)

---

## 📚 Key Design Decisions

### Why LangGraph?

- ✅ Built for agentic workflows
- ✅ Easy tool integration
- ✅ Memory management out-of-the-box
- ✅ ReAct pattern implementation

### Why Express over Next.js API Routes?

- ✅ Simpler for hackathon timeline
- ✅ Separation of concerns (frontend/backend)
- ✅ Easier to run/debug independently
- ✅ More flexible deployment options

### Why Mock Mode?

- ✅ Develop without API costs
- ✅ Faster iteration cycles
- ✅ Safer for demos (no live API failures)
- ✅ Consistent test data

### Why OpenRouter over Direct OpenAI?

- ✅ Access to multiple models
- ✅ Future-proof (model switching)
- ✅ Competitive pricing
- ✅ Hackathon differentiator

---

## 🎯 Architecture Goals

1. **Speed:** Get from idea → working demo in 4 hours
2. **Reliability:** Mock mode ensures demos never fail
3. **Extensibility:** Easy to add new models/features
4. **Simplicity:** Minimal abstractions, readable code
5. **Demo-Ready:** Architecture itself is impressive to judges

---

## 💡 Demo Talking Points

**For Judges:**

> "We built a full-stack AI agent using LangGraph for orchestration and OpenRouter for multi-model access. The architecture supports both web search via Tavily and conversational memory for context-aware recommendations."

> "We implemented a mock mode toggle that lets us demo without live API dependency - perfect for reliability during presentations."

> "The modular design makes it trivial to swap models or add new AI personalities - we can switch from GPT-4 to Claude in one line of code."

**Technical Highlights:**

- ✅ ReAct agent pattern with tools
- ✅ Multi-model capability via OpenRouter
- ✅ Conversation state management
- ✅ Environment-based configuration
- ✅ Graceful error handling
- ✅ Mock mode for development

---

## 🔮 Future Architecture Vision

### Phase 2: Multi-Model Personalities

- Parallel model calls
- Personality-based UI (chat bubbles)
- Model voting/ranking

### Phase 3: Persistent Storage

- User accounts
- Vibe history database
- Cart persistence
- Analytics tracking

### Phase 4: Real Commerce Integration

- Shopify API
- Amazon Product API
- Real product matching
- Checkout flow

---

**Last Updated:** November 11, 2025  
**Version:** 1.0 (Hackathon MVP)
