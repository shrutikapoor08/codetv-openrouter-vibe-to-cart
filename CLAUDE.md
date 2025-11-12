# AI Agent Guide - Vibe to Cart

> **For AI coding agents (Claude, GPT-4, etc.) working on this codebase**

This document provides context and guidance for AI assistants helping to develop, debug, or extend this project.

---

## 🎯 Project Context

**What:** AI-powered "vibe-based" e-commerce recommendation system  
**Purpose:** 4-hour hackathon project - fun first, polish second  
**Goal:** Transform user emotional states into product recommendations with humor  
**Stack:** React + Express + LangChain + OpenRouter

**Core Philosophy:**

- Humor > Accuracy
- Working demo > Perfect code
- Mock data > Real integrations (for speed)
- Fun personalities > Generic responses

---

## 📚 Essential Reading Order

When starting work on this project, read in this order:

1. **README.md** - Quick start, setup, basic understanding
2. **REQUIREMENTS.md** - Features, timeline, TODO list
3. **ARCHITECTURE.md** - Technical design, data flow, component structure
4. **This file (AGENTS.md)** - AI agent-specific guidance

---

## 🗂️ Codebase Structure

### Backend Architecture (Service-Oriented)

```
src/api/
├── server.js                   # EXPRESS SERVER - Main HTTP routing
├── config/
│   ├── env.js                 # CENTRALIZED CONFIG - Environment variables
│   └── apiKeyValidation.js    # ENV VALIDATION - API key checks
├── services/
│   ├── aiAgent.js             # AI AGENT - LangGraph orchestration (THE BRAIN)
│   ├── imageGeneration.js     # IMAGE GEN - OpenRouter image creation
│   ├── vibeService.js         # VIBE CACHE - Deterministic product storage
│   └── imageService.js        # IMAGE CACHE - Product image caching
├── middleware/
│   ├── cors.js                # CORS - Cross-origin configuration
│   ├── errorHandler.js        # ERROR HANDLING - Centralized async error catching
│   └── validators.js          # VALIDATION - Request input validation
├── routes/
│   ├── vibeRoutes.js          # VIBE ENDPOINTS - /api/vibe handlers
│   ├── imageRoutes.js         # IMAGE ENDPOINTS - /api/product-image handlers
│   └── cacheRoutes.js         # CACHE ENDPOINTS - Cache management
└── utils/
    ├── paths.js               # PATH UTILS - Shared __dirname resolution
    └── mockData.js            # MOCK DATA - Test fixtures
```

### Frontend Architecture (Component-Based)

```
src/
├── App.tsx                     # MAIN APP - React entry point
├── main.tsx                    # REACT BOOTSTRAP
├── components/
│   ├── VibeForm.tsx           # FORM - Vibe input
│   ├── ProductGrid.tsx        # PRODUCTS - Product display
│   ├── CartDrawer.tsx         # CART - Shopping cart UI
│   ├── StatusDisplay.tsx      # STATUS - Loading/error states
│   └── ...
├── hooks/
│   ├── useVibeApi.ts          # API HOOK - Vibe product fetching
│   ├── useVibeSubmit.ts       # SUBMIT HOOK - Form submission logic
│   ├── useCart.ts             # CART HOOK - Cart management
│   └── useConfetti.ts         # CONFETTI HOOK - Celebration effects
├── constants.ts                # CONSTANTS - Loading messages, vibes, etc.
└── types.ts                    # TYPES - TypeScript interfaces
```

### Key Patterns

**Backend Request Flow:**

```
User Input → Express /api/vibe
          → validateVibeInput middleware
          → vibeRoutes.getVibeProducts
          → Check vibeService cache
          → If not cached: aiAgent.webSearchAgent()
          → Generate images via imageGeneration service
          → Cache in imageService
          → Return products with images
```

**Mock Mode:**

- Controlled by `MOCK_MODE` in `config/env.js`
- Bypasses all external API calls
- Returns static responses from `utils/mockData.js`
- Essential for testing without API costs

**Centralized Configuration:**

- All environment variables exported from `config/env.js`
- Single source of truth for `MOCK_MODE`, API keys, PORT
- Prevents duplication across files

---

## 🔑 Environment Variables

**Required (when MOCK_MODE=false):**

- `OPENROUTER_API_KEY` - Multi-model LLM access

**Optional:**

- `MOCK_MODE` - Set to "true" for testing (default: false)
- `PORT` - Server port (default: 3001)

**Note:** `NODE_TLS_REJECT_UNAUTHORIZED` is automatically set to "0" in development by `config/env.js`

**Never commit `.env`** - It's gitignored for security

---

## 🤖 AI Agent Architecture (The Important Part)

### Direct LLM Invocation Pattern

The `webSearchAgent` uses **direct model invocation** for product recommendations:

1. **Reason:** LLM analyzes user vibe query
2. **Generate:** Creates product recommendations with reasoning
3. **Respond:** Returns structured JSON output

**Key Components:**

```javascript
// Model
new ChatOpenAI({
  model: "openai/gpt-4o-mini",
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});

// Direct invocation
const response = await model.invoke([question]);
```

### OpenRouter Configuration

**Critical Headers:**

```javascript
defaultHeaders: {
  "HTTP-Referer": "https://github.com/shrutikapoor08/...",
  "X-Title": "Vibe to Cart"
}
```

These are **required** by OpenRouter for tracking/analytics.

---

## 🛠️ Common Tasks for AI Agents

### Task: Add a New Endpoint

1. Open `src/api/server.js`
2. Add route handler:
   ```javascript
   app.get("/your-endpoint", async (req, res) => {
     try {
       // Your logic
       res.json({ success: true });
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });
   ```
3. Test with: `curl http://localhost:3001/your-endpoint`

### Task: Modify AI Prompt

1. Open `src/api/services/aiAgent.js`
2. Locate the `createVibePrompt` function
3. Update the prompt template
4. The prompt is used to generate product recommendations
   ```javascript
   const question = new HumanMessage("Your custom prompt here");
   ```

### Task: Add Mock Response

1. Open `src/api/utils/mockData.js`
2. Find `MOCK_VIBES` object
3. Add new key-value pair with your vibe and products
   ```javascript
   const mockResponses = {
     "new vibe input": "Your mock response here",
     // ...existing
   };
   ```

### Task: Switch AI Models

1. Open `src/api/services/aiAgent.js`
2. Change the `model` parameter in the `ChatOpenAI` initialization:
   ```javascript
   new ChatOpenAI({
     model: "anthropic/claude-3.5-sonnet", // or any OpenRouter model
     // ...rest
   });
   ```

Available models: `openai/gpt-4o`, `anthropic/claude-3.5-sonnet`, `meta-llama/llama-3.1-70b-instruct`, etc.

---

## 🎨 UI Development Guidelines

### Current State

- Basic React + Vite setup
- Minimal styling
- **NEEDS WORK** - This is the main TODO

### What to Build (Priority Order)

1. **Vibe Input Component**

   - Large text input field
   - Placeholder: "Tell us your vibe... (e.g., villain era, hot mess express)"
   - "Get My Vibe" button
   - Loading state with funny messages

2. **Product Card Component**

   ```tsx
   interface Product {
     emoji: string;
     name: string;
     reason: string;
   }
   ```

   Display as cards with hover effects

3. **Cart Drawer**

   - Slide-out panel
   - Show count of "vibe items"
   - Confetti on add

4. **Roast Mode Toggle**
   - Switch between "recommend" and "roast" modes
   - Changes AI personality

### Styling Approach

- Use **Tailwind CSS** (needs to be set up)
- Mobile-first responsive
- Fun, playful aesthetics (NOT corporate)
- Gradients, shadows, animations encouraged

---

## 🧪 Testing Strategies

### Manual Testing Commands

```bash
# Test with mock mode
curl "http://localhost:3001/agent?query=villain+era"

# Test specific vibe
curl "http://localhost:3001/agent?query=hot+girl+autumn+but+broke"

# Test error handling
curl "http://localhost:3001/agent?query="
```

### Expected Behavior

**Mock Mode (MOCK_MODE=true):**

- Returns instantly (~500ms)
- No API calls
- Predictable responses

**Production Mode (MOCK_MODE=false):**

- Takes 3-10 seconds (AI processing)
- Real OpenRouter API calls
- Unique responses each time

---

## ⚠️ Common Pitfalls & Solutions

### Issue: "Missing credentials" Error

**Cause:** OpenRouter API key not found  
**Fix:**

1. Check `.env` exists
2. Ensure `OPENROUTER_API_KEY=sk-or-v1-...` is set
3. Restart server

### Issue: SSL Certificate Error

**Cause:** Corporate proxy intercepting HTTPS  
**Current Workaround:** `NODE_TLS_REJECT_UNAUTHORIZED = "0"` in agent.js  
**Proper Fix:** Add to TODO - make conditional on environment variable

### Issue: Port Already in Use

**Fix:**

```bash
PORT=3002 npm run server
```

### Issue: React Component Not Updating

**Cause:** Probably state management issue  
**Debug:**

1. Check `useState` hooks
2. Verify API response format
3. Console log state changes

---

## 🎯 High-Priority TODOs for AI Agents

When asked to "work on the project," prioritize these:

### 1. Create `/api/vibe` Endpoint (CRITICAL)

- New route specifically for vibe → product conversion
- Different from `/agent` (which is generic search)
- Should return structured JSON:
  ```json
  {
    "products": [{ "emoji": "🖤", "name": "...", "reason": "..." }]
  }
  ```

### 2. Build Vibe Input UI (HIGH PRIORITY)

- Replace default Vite React template
- Clean, centered input field
- Gradient background
- "Get My Vibe" button with hover effects

### 3. Update AI Prompt (CRITICAL)

- Change from generic search to product recommendations
- Must return JSON array format
- Include humor/sass in responses
- See REQUIREMENTS.md for exact prompt template

### 4. Create Mock Product Database (MEDIUM)

- JSON file with ~20-30 funny products
- Include emoji, name, category, reason fields
- Use for fallback/testing

### 5. Implement Product Cards (HIGH PRIORITY)

- Grid layout
- Hover animations
- "Add to Cart" button (even if fake)

---

## 🔮 Advanced Features (Phase 2+)

### Multi-Model "Vibe Committee"

**Concept:** Call 3 different models in parallel for different "personalities"

```javascript
const [claude, gpt, mistral] = await Promise.all([
  callOpenRouter("anthropic/claude-3.5-sonnet", vibe),
  callOpenRouter("openai/gpt-4o", vibe),
  callOpenRouter("mistralai/mistral-large", vibe),
]);
```

**Display:** Chat bubbles with different colors per model

### "Explain My Cart" Feature

**Prompt:**

```
Analyze these products and roast what they say about this person.
Be funny, dramatic, and slightly mean.

Products: {{cart_items}}
```

**Output:** Personality analysis based on cart

---

## 📝 Code Style Preferences

### JavaScript/TypeScript

- Use modern ES6+ syntax
- Async/await over promises
- Descriptive variable names
- Comments for complex logic only

### React

- Functional components only
- Hooks over class components
- TypeScript interfaces for props
- Keep components small and focused

### Error Handling

- Always try/catch in async functions
- Log errors with context
- Return user-friendly error messages
- Don't crash on API failures

---

## 🚨 What NOT to Do

❌ **Don't** add heavy dependencies without asking  
❌ **Don't** refactor working code unless requested  
❌ **Don't** remove mock mode (it's essential for testing)  
❌ **Don't** commit API keys or `.env`  
❌ **Don't** over-engineer (this is a hackathon project)  
❌ **Don't** break the existing `/agent` endpoint  
❌ **Don't** make it corporate/boring (keep it fun!)

---

## ✅ What TO Do

✅ **Do** ask clarifying questions before big changes  
✅ **Do** maintain mock mode functionality  
✅ **Do** add comments for complex logic  
✅ **Do** test endpoints after changes  
✅ **Do** keep responses funny/sassy  
✅ **Do** prioritize demo-readiness over perfection  
✅ **Do** follow the existing patterns (ReAct agent, Express routes)

---

## 🎤 Demo Preparation Checklist

When asked to "prepare for demo":

- [ ] Test all major user flows
- [ ] Verify mock mode works (backup plan)
- [ ] Check mobile responsiveness
- [ ] Test with 3-5 hilarious vibes
- [ ] Ensure error messages are user-friendly
- [ ] Confirm loading states show
- [ ] Check that confetti/animations work
- [ ] Verify no console errors in browser
- [ ] Test cart functionality
- [ ] Prepare backup screenshots/video

---

## 🔍 Debugging Tips

### Backend Issues

```bash
# Enable verbose logging
DEBUG=* npm run server

# Test agent directly
node --env-file=.env -e "import('./src/api/services/aiAgent.js').then(m => m.webSearchAgent({description: 'test'}))"
```

### Frontend Issues

- Open browser DevTools Console (F12)
- Check Network tab for failed requests
- Verify API responses in Network > Preview

### AI Agent Issues

- Check OpenRouter dashboard for API usage/errors
- Verify model name is correct (case-sensitive)
- Test with mock mode first
- Check that tools are being invoked (should see in logs)

---

## 📊 Performance Expectations

**API Response Times:**

- Mock mode: ~500ms
- Real mode (with search): 5-15 seconds
- Real mode (without search): 2-5 seconds

**If slower:**

- Check network connection
- Verify OpenRouter API status
- Consider using faster model (gpt-4o-mini vs gpt-4)

---

## 🎯 Success Criteria for AI Agents

You're doing a good job if:

✅ Code changes don't break existing functionality  
✅ Mock mode still works for testing  
✅ New features align with "fun first" philosophy  
✅ Error handling is graceful  
✅ UI updates are visually appealing  
✅ You ask before major architectural changes  
✅ Changes are well-tested  
✅ Documentation is updated

---

## 🆘 When to Ask for Human Help

Ask the human developer if:

- Major architectural decisions needed
- Budget/API cost concerns
- Unclear requirements or priorities
- Multiple valid approaches (need preference)
- Breaking changes to core functionality
- Deployment or production concerns
- Third-party integrations beyond OpenRouter

---

## 🎁 Quick Wins for AI Agents

Easy tasks that add value:

1. **Add more mock responses** - Expand `mockResponses` object
2. **Improve error messages** - Make them funnier/more helpful
3. **Add loading messages** - Rotate funny strings during API calls
4. **Create easter eggs** - Special responses for specific vibes
5. **Add input validation** - Check for empty/too-long inputs
6. **Improve console logging** - Better debugging info
7. **Add TypeScript types** - For better IDE support
8. **Create reusable components** - Button, Card, Input
9. **Add animation classes** - Tailwind transitions
10. **Write inline documentation** - JSDoc comments

---

## 🔗 External Resources

- [OpenRouter Docs](https://openrouter.ai/docs)
- [LangChain JS Docs](https://js.langchain.com/docs/)
- [LangGraph Docs](https://langchain-ai.github.io/langgraphjs/)
- [React Docs](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 💡 Final Notes for AI Agents

**Remember:**

- This is a **hackathon project** - speed over perfection
- **Humor is the goal** - boring outputs = failure
- **Mock mode is sacred** - never remove it
- **The demo is everything** - functionality > elegance
- **Have fun with it** - inject personality into the code

**When in doubt:**

1. Check REQUIREMENTS.md for context
2. Check ARCHITECTURE.md for patterns
3. Keep it simple and working
4. Ask the human

---

**Good luck, fellow AI! May your tokens be many and your errors be few. 🤖✨**

---

Last Updated: November 11, 2025
