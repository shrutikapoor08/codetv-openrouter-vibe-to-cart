import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
import { MOCK_VIBES, DEFAULT_VIBE, ROAST_RESPONSES } from "./mockData.js";

// Configuration
const MOCK_MODE = process.env.MOCK_MODE === "true";

// Hackathon mode - allow self-signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

/**
 * Get mock response for a given vibe
 * @param {string} vibe - User's vibe description
 * @param {boolean} roastMode - Whether to roast instead of recommend
 * @returns {string} JSON stringified product array or roast message
 */
function getMockVibeResponse(vibe, roastMode = false) {
  if (roastMode) {
    // Return a roast instead of products
    const roast =
      ROAST_RESPONSES[vibe.toLowerCase().trim()] || ROAST_RESPONSES.default;
    return JSON.stringify([
      {
        emoji: "🔥",
        name: "Reality Check",
        reason: roast,
      },
    ]);
  }

  const normalizedVibe = vibe.toLowerCase().trim();
  const products = MOCK_VIBES[normalizedVibe] || DEFAULT_VIBE;
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
    return `You are RoastBot, a brutally honest AI with zero chill.
The user described their vibe as: "${vibe}"

Your job is to roast their vibe in a funny, dramatic, slightly mean way.
Be honest, witty, and entertaining. Think: "I'm not mad, I'm just disappointed."

Respond with ONLY a JSON array with ONE item:
[
  {
    "emoji": "🔥",
    "name": "Reality Check", 
    "reason": "Your hilarious roast here (2-3 sentences max)"
  }
]

Make it funny but not cruel. Think sassy best friend, not bully.`;
  }

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
