import "dotenv/config";

import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
import { kMaxLength } from "buffer";

// Fix for self-signed certificate issues (development only)
// Remove this in production or configure proper certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// AGENT
/*
Model - OpenAI GPT 4o
Memory - Short Term, Long Term.
Tools - Tavily Search (web search - figuring out proximity), Parser Tool (DIY)
*/

// Mock mode - set MOCK_MODE=true in .env.local to use mock responses
const MOCK_MODE = process.env.MOCK_MODE === "true";

// Mock responses for testing
const mockResponses = {
  "Where is San Jose?":
    "San Jose is a city located in Northern California, in the southern part of the San Francisco Bay Area. It is the largest city in Silicon Valley and the third-largest city in California. San Jose is the county seat of Santa Clara County.",
  default:
    "This is a mock response. The agent would normally search the web and provide an answer based on the query. To use real API calls, set MOCK_MODE=false in your .env.local file.",
};

const webSearchAgent = async ({ description }) => {
  // Mock mode - return mock response without API calls
  if (MOCK_MODE) {
    console.log("🎭 MOCK MODE: Returning mock response without API calls");
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
    return mockResponses[description] || mockResponses.default;
  }

  try {
    console.log("Initializing TavilySearch tool...");
    const webTool = new TavilySearch({
      maxResults: 3,
      tavilyApiKey: process.env.TAVILY_API_KEY,
    });

    console.log("Initializing OpenRouter model...");
    // OpenRouter integration using ChatOpenAI with custom configuration
    const agentModel = new ChatOpenAI({
      model: "openai/gpt-4o-mini", // You can change this to other models available on OpenRouter
      temperature: 0,
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

    const agentCheckpointer = new MemorySaver(); // Initialize memory to persist state between graph runs

    console.log("Creating React agent...");
    const agent = createReactAgent({
      llm: agentModel,
      tools: [webTool],
      checkpointSaver: agentCheckpointer,
    });

    const question = new HumanMessage(JSON.stringify(description));

    console.log("Invoking agent with question:", description);
    const agentNextState = await agent.invoke(
      { messages: [question] },
      { configurable: { thread_id: "vndfjkvnjkdf" } }
    );

    console.log(
      agentNextState.messages[agentNextState.messages.length - 1].content
    );

    const result =
      agentNextState.messages[agentNextState.messages.length - 1].content;

    return result;
  } catch (error) {
    console.error("Error in webSearchAgent:", error);
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    throw error;
  }
};

export default webSearchAgent;
