import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
import {
  MOCK_MODE,
  OPENROUTER_API_KEY,
  TAVILY_API_KEY,
} from "../config/env.js";
import {
  MOCK_VIBES,
  DEFAULT_VIBE,
  ROAST_RESPONSES,
} from "../utils/mockData.js";

// Load environment variables from .env file
dotenv.config({ path: [".env.local", ".env"] });

/**
 * Get mock response for a given vibe
 * @param {string} vibe - User's vibe description
 * @param {boolean} roastMode - Whether to roast instead of recommend
 * @returns {string} JSON stringified product array or roast message
 */
function getMockVibeResponse(vibe, roastMode = false) {
  const normalizedVibe = vibe.toLowerCase().trim();
  const products = MOCK_VIBES[normalizedVibe] || DEFAULT_VIBE;

  if (roastMode) {
    // Return roasted versions of the products
    const roastIntro =
      ROAST_RESPONSES[normalizedVibe] || ROAST_RESPONSES.default;

    return JSON.stringify(
      products.map((product, index) => ({
        ...product,
        reason:
          index === 0
            ? `${roastIntro} Anyway, ${product.reason.toLowerCase()}`
            : product.reason,
      }))
    );
  }

  return JSON.stringify(products);
}

/**
 * Creates the VibeBot prompt for product recommendations
 * @param {string} vibe - User's vibe description
 * @param {boolean} roastMode - Whether to roast instead of recommend
 * @returns {string} Formatted prompt for the AI
 */
function createVibePrompt(vibe, roastMode = false) {
  if (roastMode) {
    return `You are RoastBot, a brutally honest personal shopper with zero chill and maximum sass.
The user described their vibe as: "${vibe}"

Your job is to recommend EXACTLY 3 products that match their vibe, but roast them along the way.
Each product should be funny, slightly mean, but still useful. Think: "I'm judging you, but here's what you need."

You MUST respond ONLY as a valid JSON array with EXACTLY 3 items in this exact format:
[
  {"emoji":"🔥", "name":"Snarky Product Name", "reason":"Your witty, slightly mean justification here"},
  {"emoji":"💀", "name":"Another Roast Product", "reason":"Another sassy reason with a burn"},
  {"emoji":"😬", "name":"Third Roast Product", "reason":"Final roast justification"}
]

IMPORTANT: Return EXACTLY 3 products, no more, no less.
Be funny, sarcastic, and slightly mean - but still recommend actual products.
DO NOT include any other text, explanations, or markdown formatting. ONLY the JSON array.

User vibe: ${vibe}`;
  }

  return `You are VibeBot, a hilarious, over-the-top fashion stylist and personal shopper with a sassy personality.

The user will describe their vibe/mood/aesthetic. You must respond with EXACTLY 3 CLOTHING or FASHION ACCESSORY recommendations that match that vibe.

IMPORTANT: ALL products must be wearable items - clothing, shoes, accessories, jewelry, bags, etc. NO home goods, candles, or non-fashion items.

Each item MUST have:
- emoji: single emoji that represents the clothing/accessory (use fashion emojis like 👗👕👔🧥👠👢👜🕶️💍🧣🎒👒)
- name: creative, funny product name for a CLOTHING/FASHION item
- reason: humorous one-liner justification (be witty, sarcastic, or dramatic)

You MUST respond ONLY as a valid JSON array with EXACTLY 3 items in this exact format:
[
  {"emoji":"👗", "name":"Clothing Product Name Here", "reason":"Funny reason here"},
  {"emoji":"🕶️", "name":"Fashion Accessory Name", "reason":"Another witty justification"},
  {"emoji":"👢", "name":"Footwear or Fashion Item", "reason":"Final witty justification"}
]

IMPORTANT: Return EXACTLY 3 products, no more, no less. ALL must be fashion/clothing items.
DO NOT include any other text, explanations, or markdown formatting. ONLY the JSON array.

User vibe: ${vibe}`;
}

/**
 * Main agent function - processes user vibes and returns product recommendations
 * @param {Object} params
 * @param {string} params.description - User's vibe description
 * @param {boolean} params.roastMode - Whether to roast instead of recommend
 * @returns {Promise<string>} JSON string of product recommendations or roast
 */
const webSearchAgent = async ({ description, roastMode = false }) => {
  // Mock mode - return mock response without API calls
  if (MOCK_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
    return getMockVibeResponse(description, roastMode);
  }

  try {
    // Initialize tools
    const webTool = new TavilySearch({
      maxResults: 3,
      tavilyApiKey: TAVILY_API_KEY,
    });

    // Initialize OpenRouter model
    const agentModel = new ChatOpenAI({
      model: "openai/gpt-4o-mini",
      temperature: 0.7, // Increased for more creative responses
      apiKey: OPENROUTER_API_KEY,
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
    const vibePrompt = createVibePrompt(description, roastMode);
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

/**
 * Roast the user's cart items
 * @param {Array} cartItems - Array of products in the cart
 * @returns {Promise<string>} A funny roast about their shopping choices
 */
export const roastCart = async (cartItems) => {
  // Mock mode - return mock roast
  if (MOCK_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return "Looking at your cart, I can tell you're the type of person who adds items to cart just to feel something.";
  }

  if (!cartItems || cartItems.length === 0) {
    return "Your cart is empty, just like your will to commit to anything.";
  }

  try {
    // Initialize OpenRouter model
    const model = new ChatOpenAI({
      model: "openai/gpt-4o-mini",
      temperature: 0.9, // High temperature for creative roasts
      apiKey: OPENROUTER_API_KEY,
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

    const itemNames = cartItems.map((item) => item.name).join(", ");
    const prompt = `You are RoastBot, a brutally honest shopping critic with zero chill.

The user has these items in their cart: ${itemNames}

Roast their shopping choices in EXACTLY 1 sentence. Be funny, dramatic, and slightly mean. 
Think: "What do these purchases say about this person?"
Be witty and entertaining, like a sassy best friend, not cruel.

IMPORTANT: Your response must be EXACTLY 1 sentence - no more, no less.
Respond with ONLY the roast text, no quotes, no extra formatting.`;

    const response = await model.invoke([new HumanMessage(prompt)]);
    return response.content;
  } catch (error) {
    console.error("❌ Error roasting cart:", error.message);
    return "I'd roast your cart, but it looks like my AI is having a breakdown. How fitting.";
  }
};
