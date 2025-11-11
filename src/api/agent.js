import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";

// Configuration
const MOCK_MODE = process.env.MOCK_MODE === "true";

// Hackathon mode - allow self-signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Mock vibe-based product recommendations for testing
const MOCK_VIBES = {
  "villain era": [
    {
      emoji: "🕶️",
      name: "Sunglasses So Dark Your Emotions Can't Escape",
      reason: "Because eye contact is for people who aren't plotting.",
    },
    {
      emoji: "🖤",
      name: "Black Hoodie (Oversized)",
      reason: "For emotional support and mysterious exits.",
    },
    {
      emoji: "💅",
      name: "Therapy Journal (Never Opened)",
      reason: "Journaling is self-care. Not opening it is self-preservation.",
    },
  ],
  "hot girl autumn but broke": [
    {
      emoji: "🍂",
      name: "Pumpkin Spice Candle from Target",
      reason: "The aesthetic costs $7.99. Your credit card thanks you.",
    },
    {
      emoji: "🧣",
      name: "Thrifted Oversized Sweater",
      reason: "Vintage = expensive. Secondhand = financially responsible icon.",
    },
    {
      emoji: "☕",
      name: "Home Coffee Maker",
      reason: "$5 lattes are cute until rent is due.",
    },
  ],
  "cottagecore ceo": [
    {
      emoji: "🌿",
      name: "Linen Blazer in Sage Green",
      reason: "Business meetings, but make it ethereal forest nymph.",
    },
    {
      emoji: "📚",
      name: "Leather-Bound Planner",
      reason: "Schedule your empire between foraging and mindfulness.",
    },
    {
      emoji: "🕯️",
      name: "Beeswax Candles (Artisanal)",
      reason: "Boardroom lighting should smell like a meadow.",
    },
  ],
  "chaotic good but make it fashion": [
    {
      emoji: "✨",
      name: "Sequined Jacket (Mismatched)",
      reason: "Saving the world requires sparkle and zero coordination.",
    },
    {
      emoji: "🎨",
      name: "Paint-Splattered Combat Boots",
      reason: "For kicking ass and attending art openings.",
    },
    {
      emoji: "🌈",
      name: "Rainbow Fanny Pack",
      reason: "Practical chaos storage for your chaotic good adventures.",
    },
  ],
  "divorced but thriving": [
    {
      emoji: "💃",
      name: "Red Dress (Revenge Edition)",
      reason: "You didn't lose a spouse, you gained a wardrobe upgrade.",
    },
    {
      emoji: "🥂",
      name: "Champagne Flutes (Set of One)",
      reason: "Cheers to never sharing your prosecco again.",
    },
    {
      emoji: "📱",
      name: "Dating App Premium Subscription",
      reason: "Their loss is someone else's gain.",
    },
  ],
  "post-apocalyptic brunch influencer": [
    {
      emoji: "🥑",
      name: "Avocado Toast in a Bunker",
      reason: "The world may be ending, but your aesthetic isn't.",
    },
    {
      emoji: "⚔️",
      name: "Designer Machete",
      reason: "For cutting through zombies and bad vibes.",
    },
    {
      emoji: "📸",
      name: "Solar-Powered Ring Light",
      reason: "Document the apocalypse in golden hour lighting.",
    },
  ],
  "startup founder in denial": [
    {
      emoji: "💡",
      name: "Lightbulb Moment Sticky Notes",
      reason: "All your pivots in one place.",
    },
    {
      emoji: "☕",
      name: "Espresso Machine (Industrial)",
      reason: "Sleep is for companies with Series B funding.",
    },
    {
      emoji: "🎢",
      name: "Emotional Rollercoaster Season Pass",
      reason: "It's not failure, it's learning. (It's failure.)",
    },
  ],
  "cyberpunk beach bum": [
    {
      emoji: "🌊",
      name: "Neon Surfboard",
      reason: "Catch waves and hack the mainframe.",
    },
    {
      emoji: "🕶️",
      name: "AR Sunglasses",
      reason: "See the ocean AND your cryptocurrency crash in real-time.",
    },
    {
      emoji: "�️",
      name: "Solar-Powered Hammock",
      reason: "Off-grid beach naps with WiFi somehow.",
    },
  ],
};

const DEFAULT_VIBE = [
  {
    emoji: "🎲",
    name: "Mystery Box of Chaos",
    reason: "We don't understand your vibe, so here's a random product.",
  },
  {
    emoji: "🤷",
    name: "Existential Crisis Starter Kit",
    reason: "When your vibe is too deep for our AI to comprehend.",
  },
  {
    emoji: "🔮",
    name: "Crystal Ball (Unclear Future)",
    reason: "Even AI can't predict where your vibe is going.",
  },
];

/**
 * Get mock response for a given vibe
 * @param {string} vibe - User's vibe description
 * @returns {string} JSON stringified product array
 */
function getMockVibeResponse(vibe) {
  const normalizedVibe = vibe.toLowerCase().trim();
  const products = MOCK_VIBES[normalizedVibe] || DEFAULT_VIBE;
  return JSON.stringify(products);
}

/**
 * Creates the VibeBot prompt for product recommendations
 * @param {string} vibe - User's vibe description
 * @returns {string} Formatted prompt for the AI
 */
function createVibePrompt(vibe) {
  return `You are VibeBot, a hilarious, over-the-top personal shopper with a sassy personality.

The user will describe their vibe/mood/aesthetic. You must respond with 3-5 funny, dramatic, or oddly specific product recommendations that match that vibe.

Each item MUST have:
- emoji: single emoji that represents the product
- name: creative, funny product name
- reason: humorous one-liner justification (be witty, sarcastic, or dramatic)

You MUST respond ONLY as a valid JSON array in this exact format:
[
  {"emoji":"🕶️", "name":"Product Name Here", "reason":"Funny reason here"},
  {"emoji":"🖤", "name":"Another Product", "reason":"Another witty justification"}
]

DO NOT include any other text, explanations, or markdown formatting. ONLY the JSON array.

User vibe: ${vibe}`;
}

/**
 * Main agent function - processes user vibes and returns product recommendations
 * @param {Object} params
 * @param {string} params.description - User's vibe description
 * @returns {Promise<string>} JSON string of product recommendations
 */
const webSearchAgent = async ({ description }) => {
  // Mock mode - return mock response without API calls
  if (MOCK_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
    return getMockVibeResponse(description);
  }

  try {
    // Initialize tools
    const webTool = new TavilySearch({
      maxResults: 3,
      tavilyApiKey: process.env.TAVILY_API_KEY,
    });

    // Initialize OpenRouter model
    const agentModel = new ChatOpenAI({
      model: "openai/gpt-4o-mini",
      temperature: 0.7, // Increased for more creative responses
      apiKey: process.env.OPENROUTER_API_KEY,
      maxRetries: 2,
      configuration: {
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
          "HTTP-Referer":
            "https://github.com/shrutikapoor08/codetv-openrouter-vibe-to-cart",
          "X-Title": "Vibe to Cart",
        },
      },
    });

    // Initialize memory for conversation persistence
    const agentCheckpointer = new MemorySaver();

    // Create ReAct agent
    const agent = createReactAgent({
      llm: agentModel,
      tools: [webTool],
      checkpointSaver: agentCheckpointer,
    });

    // Create the prompt and invoke agent
    const vibePrompt = createVibePrompt(description);
    const question = new HumanMessage(vibePrompt);

    const agentNextState = await agent.invoke(
      { messages: [question] },
      { configurable: { thread_id: "vibe-session" } }
    );

    const result =
      agentNextState.messages[agentNextState.messages.length - 1].content;

    return result;
  } catch (error) {
    console.error("❌ Error in webSearchAgent:", error.message);
    throw error;
  }
};

export default webSearchAgent;
