# Vibe to Cart - Project Requirements

## 🎯 Project Overview

**Tagline:** Tell us your vibe. We'll tell you what to buy.

**Timeline:** 4-hour hackathon

**Goal:** Build a silly, fun e-commerce experience that turns user "vibes" into product recommendations using AI

---

## ✅ TODO List - Implementation Roadmap

### Phase 1: Core MVP (Hours 1-2)

- [x] **Create Vibe Input UI** - Text input field with placeholder text
- [x] **Style with Tailwind CSS** - Make it look polished and fun (used custom CSS instead)
- [x] **Create /api/vibe endpoint** - New endpoint specifically for vibe-to-product conversion
- [x] **Update AI prompt** - Change from generic search to product recommendation prompt
- [x] **Create mock product database** - JSON file with funny products (8 vibes in agent.js)
- [x] **Implement product card display** - Show emoji, name, reason in cards
- [x] **Add "Get My Vibe" button** - Main CTA with loading state

### Phase 2: Polish & Features (Hour 3)

- [x] **Add loading animations** - Funny rotating messages ("Consulting your inner chaos...")
- [x] **Implement "Surprise Me" button** - Random vibe generator (15 preset vibes)
- [x] **Create fake cart functionality** - Count items, show drawer
- [x] **Add confetti effect** - On "Add to Cart" click
- [x] **Implement Roast Mode toggle** - Alternative AI personality
- [x] **Add easter eggs** - Special responses for specific vibes
- [x] **Vibe history display** - Show past vibes entered

### Phase 3: Advanced Features (Hour 4)

- [ ] **Multi-Model "Vibe Committee"** - Call multiple models in parallel
- [ ] **Display as chat conversation** - Different colored bubbles per model
- [ ] **"Explain My Cart" feature** - AI analyzes cart items
- [ ] **"Future You" predictor** - 6-month prediction based on vibe
- [ ] **Add sound effects** - Notification pings, cart sounds
- [ ] **Mobile responsive design** - Ensure works on all devices

### Code Cleanup

- [x] **Remove excessive console logging** - Clean up debug logs
- [x] **Remove TLS certificate workaround** - Make it conditional on env variable (simplified to always-on for hackathon)
- [ ] **Add error boundaries** - Graceful error handling in React
- [ ] **Optimize API calls** - Caching, rate limiting considerations

### Demo Preparation

- [ ] **Prepare demo script** - Practice 3-5 minute presentation
- [ ] **Test with hilarious vibes** - Ensure outputs are funny
- [ ] **Screenshot/record demo** - Backup in case live demo fails
- [ ] **Prepare talking points** - Architecture highlights for judges

---

## 💡 Concept

A web app where users describe their current vibe/mood/aesthetic, and get funny, over-the-top product recommendations with sassy commentary.

### Example Inputs:

- "I'm in my villain era"
- "I want to look like I have my life together (but don't)"
- "I'm trying to impress my ex's new girlfriend"
- "Cottagecore CEO"
- "Cyberpunk beach bum"
- "Hot girl autumn but broke"
- "Startup founder in denial"

### Example Output:

```
🕶️ "Sunglasses so dark even your emotions can't escape."
🖤 "Black hoodie, oversized — for emotional support and mysterious exits."
💅 "Therapy not included."
```

---

## 🏗️ Architecture

### Tech Stack

| Layer        | Technology                            | Purpose                                     |
| ------------ | ------------------------------------- | ------------------------------------------- |
| Frontend     | React + Tailwind CSS                  | Simple UI for vibe input and product cards  |
| Backend      | Node/Express                          | API endpoint to process vibes               |
| AI           | OpenRouter (GPT-4.1 or Claude Sonnet) | Generate product recommendations + captions |
| Product Data | Static JSON mock list                 | Fast, controllable, funnier than real data  |
| Deployment   | Vercel/Netlify                        | Quick demo hosting                          |

### Why This Stack?

- ✅ **LangChain (Light):** Clean orchestration, structured output parsing, looks technical for judges
- ✅ **OpenRouter:** Multiple model options, creative outputs
- ❌ **Skip Tavily:** Real product data adds complexity; fake data is faster and funnier
- ❌ **Skip heavy frameworks:** 4 hours = speed over scalability

---

## ⏱️ 4-Hour Build Plan

### Hour 1 – Brainstorm & Setup

- ✅ Finalize AI prompt design
- ✅ Spin up React app
- ✅ Basic page: input box + "Get My Vibe" button + output area

### Hour 2 – Connect OpenRouter

- Create `/api/vibe` endpoint
- Call OpenRouter API with custom prompt
- Parse and return structured JSON to frontend
- Optional: Model chaining (vibe → keywords → products)

### Hour 3 – UI Polish & Fun

- Display product cards with emoji + name + reason
- Add mock "Vibe Cart" drawer
- Humorous loading text ("Consulting your inner drama queen…")
- Random easter eggs ("We sense chaotic energy. Recommending glitter.")

### Hour 4 – Demo Polish

- Add "Vibe History" to show past vibes
- "Surprise Me" button with random vibes
- Prepare 3-5 minute demo script
- Test with hilarious example vibes

---

## 🎨 Core Features

### MVP (Must Have)

1. **Vibe Input:** Text field for user to describe their vibe
2. **AI Processing:** OpenRouter integration to generate recommendations
3. **Product Display:** Cards showing emoji, product name, and witty reason
4. **Responsive Design:** Works on mobile and desktop

### Polish Features (Nice to Have)

1. **Roast Mode Toggle:** Instead of products, AI roasts your vibe
2. **Surprise Me Button:** Generates random chaotic vibes
3. **Fake Cart:** "Add to Vibe Cart" with count/confetti
4. **Vibe History:** Track past vibes entered
5. **Loading States:** Rotating funny messages
6. **Easter Eggs:** Special responses for specific vibes

### Bonus Ideas (If Time)

- 🎤 Voice input for vibe ("Tell us your vibe")
- 🖼️ AI-generated vibe collage images
- 🧺 "Cart Vibescore" - analyzes what your cart says about you
- 🔊 Sound effects on cart add

---

## 🤖 AI Prompt Template

```
You are a hilarious, over-the-top personal shopper named VibeBot.
The user will describe their vibe. You must respond with 3-5 funny,
dramatic, or oddly specific product recommendations that match that vibe.

Each item should have:
- name: product name
- emoji: single emoji that represents the product
- reason: humorous one-liner justification

Respond ONLY as JSON array like:
[
  {"name":"...", "emoji":"...", "reason":"..."},
  ...
]

User vibe: {{vibe}}
```

---

## 🎤 Demo Plan (3-5 minutes)

### 1. Intro (30 seconds)

"Shopping online is boring. We fixed it. Welcome to Vibe to Cart — tell us your vibe, we'll tell you your destiny."

### 2. Live Demo (2 minutes)

- Type example vibes:
  - "Divorced but thriving"
  - "Chaotic good but make it fashion"
  - "Post-apocalyptic brunch influencer"
- Show AI generating items
- Add one to cart for flair

### 3. Explain Tech (1 minute)

- Built with React + OpenRouter
- Custom prompts for humor
- Could integrate real commerce APIs later
- Mock product dataset for speed

### 4. Close Strong (30 seconds)

"Stop shopping by category. Start shopping by vibe. Because your personality deserves 2-day shipping."

---

## 🎯 Success Criteria

### Technical

- ✅ API successfully calls OpenRouter
- ✅ Frontend displays structured product data
- ✅ Error handling for failed API calls
- ✅ Responsive UI that looks polished

### Presentation

- ✅ Makes judges laugh
- ✅ Demo runs smoothly with no bugs
- ✅ Clear value proposition
- ✅ Memorable/shareable concept

### Bonus Points

- Creative use of OpenRouter models
- Unique/unexpected features (Roast Mode, easter eggs)
- Could realistically become a viral product
- Clean, maintainable code

---

## 📝 Mock Product Ideas

Categories to include in static JSON:

- Clothing (hoodies, sunglasses, accessories)
- Home decor (candles, plants, aesthetic objects)
- Tech (gadgets, stickers)
- Lifestyle (journals, self-care items)
- Food/Drinks (energy drinks, snacks)
- Books/Media (manifestation guides, podcasts)

Include fake brand names like:

- "SadBoi Supply Co."
- "Main Character Energy LLC"
- "Delulu Is The Solulu"
- "Emotional Damage Depot"

---

## 🚀 Deployment Checklist

- [ ] Environment variables configured (OPENROUTER_API_KEY)
- [ ] Frontend builds without errors
- [ ] API endpoint returns valid JSON
- [ ] Demo vibes tested and working
- [ ] Mobile responsive
- [ ] Fast loading times
- [ ] Demo script rehearsed

---

## 🎨 Design Philosophy

**Priorities:**

1. **Fun First** - Humor > Accuracy
2. **Fast Execution** - Working demo > Perfect code
3. **Demo Polish** - Visual appeal for judges
4. **Memorable** - Should stick in people's minds

**Avoid:**

- Over-engineering
- Complex data pipelines
- Real API integrations (unless trivial)
- Perfect accuracy (embrace chaos)

---

## � Advanced OpenRouter Features

### 1. Multi-Model Personalities - "Vibe Committee" Mode

**Concept:** Use OpenRouter's multi-model access to create different AI personalities that debate/collaborate on product recommendations.

**Implementation:**

- Call multiple models simultaneously (GPT-4.1, Claude, Mistral, etc.)
- Each model plays a distinct personality role:
  - **Claude 🎨**: The artsy, gentle one
  - **GPT-4.1 🧠**: The logical overachiever
  - **Mistral 😈**: The chaos agent
- Display responses as a chat conversation/debate

**Example Output:**

```
Claude: "I sense an introspective, cottagecore energy — you need lavender candles."
Mistral: "Nah, give them leather boots and emotional damage."
GPT-4: "Compromise: black floral combat boots."
```

**Why It's Brilliant:**

- Showcases OpenRouter's unique multi-model capability
- Creates dynamic, funny interactions
- Visually engaging for demos
- Can add "Who Won?" voting feature

### 2. AI "Vibe Translator"

**Concept:** Translate user vibes into unexpected creative forms using different models/prompts.

**Translation Options:**

- **Vibe → Music Genre**: "You're giving early 2000s indie heartbreak."
- **Vibe → Movie Title**: "Definitely a Netflix documentary about questionable life choices."
- **Vibe → Aesthetic Board**: "Cyberpunk barista core"
- **Vibe → Poem/Song Lyric**: Custom creative output
- **Vibe → Color Palette**: Hex codes matching the vibe energy

**Implementation:**
Display translations alongside product recommendations for richer context.

### 3. "Explain My Cart" Mode

**Concept:** After users add items to their vibe cart, AI analyzes what their selections say about them.

**Prompt Template:**

```
Analyze this list of products and describe what kind of person would buy them.
Be honest, dramatic, and a little mean.

Products: {{cart_items}}
```

**Example Outputs:**

- "You're definitely running from something. Probably your responsibilities."
- "This cart screams: broke main character with a skincare addiction."
- "Three therapy journals and zero follow-through energy."

**Demo Value:** Great comedic payoff, shows AI understanding context.

### 4. "Future You" Predictor

**Concept:** Generate a narrative of what life will look like if user embraces their vibe + purchases.

**Prompt Template:**

```
Based on this vibe and these products, write a short (2-3 sentence)
prediction of what this person's life will look like in 6 months.
Be creative, funny, and slightly absurd.

Vibe: {{vibe}}
Products: {{cart_items}}
```

**Example Output:**
"You'll have three candles named after emotions, a cat named Anxiety, and a part-time crystal resale business."

**Bonus:** Could add AI image generation (OpenRouter + Flux/Playground models) for visual "future you."

### 5. Model Personality UI Display

**Frontend Implementation:**

```jsx
<div className="chat">
  {conversation.split("\n").map((line, i) => (
    <div key={i} className="border rounded-lg p-3 my-2 shadow-sm">
      {line}
    </div>
  ))}
</div>
```

**Visual Design:**

- Different background colors per personality
- Emoji avatars for each bot
- LogicBot 🧠 = blue bubble
- VibeBot 🎨 = pink bubble
- ChaosBot 😈 = black bubble
- Typewriter animation when bots "chat"
- Sound effects on message appearance

### 6. Interactive Personality Features

| Feature                     | Description                                                         |
| --------------------------- | ------------------------------------------------------------------- |
| **"Who Won?" Vote**         | Ask another model (gpt-4.1-mini) to pick the funniest/best response |
| **Add to Cart Integration** | Convert best recs from each bot into product cards                  |
| **Sound FX**                | Notification ping or typewriter animation when bots chat            |
| **Toggle Personalities**    | Let users pick 2-3 bots to "summon" (Pokémon for vibes)             |
| **Personality Stats**       | Track which bot's recommendations users prefer                      |

---

## 🎤 Advanced Demo Script

### "Vibe Committee" Demo (30-45 seconds)

**Setup:**
"Now, we wanted to show how different AI personalities shop for your vibe. Meet the Vibe Council — three AIs that can't agree on anything."

**Live Demo:**
Type in: "main character energy with student loan debt"

**AI Response Display:**

```
🎨 VibeBot: "Sequined jacket — because you're sparkling through the pain."
🧠 LogicBot: "Budget-friendly statement blazer. Sensible sparkle."
😈 ChaosBot: "Just buy sunglasses so no one sees your panic."
```

**Payoff:** Audience laughs. Judges impressed by multi-model orchestration.

---

## 💡 Why These Features Win Hackathons

✅ **Uses OpenRouter's key differentiator** - Multi-model access (not available with single-provider APIs)

✅ **Generates dynamic, funny, human-readable output** - Not just functional, but entertaining

✅ **Visually interactive** - Chat bubbles, animations, color coding = demo gold

✅ **Easy to extend** - Can layer onto existing `/api/vibe` route without major refactor

✅ **Memorable** - Judges remember "the one with arguing AI personalities"

✅ **Technical credibility** - Shows understanding of model strengths/personalities

---

## 🔧 Implementation Priority

### Must Have (Hour 3-4)

1. Basic multi-model call (2-3 personalities)
2. Display as chat conversation
3. Visual distinction between bots

### Nice to Have (If Time)

4. "Explain My Cart" feature
5. "Future You" predictions
6. Sound effects/animations
7. "Who Won?" voting

### Stretch Goals (Post-Hackathon)

8. User personality selection
9. Persistent vibe history with AI analysis
10. Image generation for "Future You"
11. Share to social media with bot conversations

---

## 💭 Key Insights

> "Using OpenRouter's multi-model access as a feature (not just a backend detail) is what separates this from basic ChatGPT wrappers."

> "Personality-driven AI interactions are more memorable than single-response systems."

> "The 'Vibe Committee' concept shows technical sophistication while being immediately funny and understandable."

---
